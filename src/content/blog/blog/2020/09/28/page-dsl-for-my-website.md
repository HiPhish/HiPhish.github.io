---
title: A page DSL for my website
category: organisation
tags: lisp, html
---

I got bitten by the Lisp bug recently again, and so I decided to clean up an
ugly wart in my static site generator which I use for generating the Workshop.
The goal was to create an embedded domain-specific language (DSL) for defining
web pages.

The original version of the Workshop was generated using [Pelican], which uses
[Jinja] for its templates. Jinja is not embedded in [Python], it is built on
top of it as a separate file format. This means that there is a disconnect
between the DSL and the host language; if we want to access one from the other
we have to perform really awkward gymnastics to pull it off.

My current static site generator on the other hand is written in [GNU Guile]
Scheme, a dialect of the Lisp programming language family. Creating an embedded
DSL in Scheme (or any Lisp) is trivial, and the two language integrate
seamlessly. In fact, most of any Lisp is usually implemented in that Lisp on
top powerful primitives.


## What is a web page?

A web page in my generator is just a dictionary structure of metadata. I am
currently using an association list for simplicity, but I could switch to
something more sophisticated like a hash table if I really wanted to. There is
nothing particularly lispy about it, such a list could be written in any
language. Here is what a simple web page looks like:

~~~scheme
'((title  . "My first web page")
  (author . "Your mom")
  (css    . ("main.css" "home.css"))
  (js     . ("sneaky-cryptominer.js" "bloated-framework-of-the-month.js"))
  (content
    (h1 "This is a title")
    (p "This is a paragraph.")
    (ol
      (li "first list item")
      (li "second list item"))
    (p "Written by 'Your mom'.")))
~~~

The metadata tags are arbitrary, it is up to the individual templates to decide
what to do with them. A template is simply a function which takes one set of
page data and transforms it into another set of data. Templates can be chained,
and eventually the final template will produce a dictionary whose `content`
contains the entire web page document tree.

The above code snippet does not look too bad. We have to be careful with all
the parentheses and periods, but it's manageable for small pages at least.
However, most web pages are not small. It is easy to miss a period, and all of
the sudden the value of the `author` is no longer the string `"Your mom"`, but
the list `("Your mom")`.


## The web page DSL

Here is what I expect from a DSL:

- Cut down on repetition
- Allow me to express my intent directly in the language of the domain
- Be safer than assembling data by hand

Writing the code out by hand is error-prone and indirect. I have to understand
how the data is going to be processed in order to be able to understand why it
is arranged the way it is. A DSL would ideally allow anyone to just write out
what they intend and have the compiler generate the corresponding Scheme code.
Or in other words, we do not write the *code* we want to execute, we write a
*specification* which the compiler will then translate into valid Scheme.

After having written a number of pages by hand I have noticed the following
pattern:

- Most of the data is very short, usually a string or a list of only a handful
	elements.
- The most important data is the content, it can get pretty large.
- I use Scheme to generate parts of the data very frequently.
- Most of the content is made of literals with the occasional evaluated code
	spliced in.

With all that in mind I came up with a DSL that lets me write the above page as
follows:

~~~scheme
(static-page ((title  "My first web page")
              (author "Your mom")
              (css    '("main.css" "home.css"))
              (js     '("sneaky-cryptominer.js"
                        "bloated-framework-of-the-month.js")))
  (h1 "This is a title")
  (p "This is a paragraph.")
  (ol
      (li "first list item")
      (li "second list item"))
  (p ,(format #f "Written by '~A'." author)))
~~~

This looks almost the same, but with some important differences:

- The content is now given as the body of the expression, it is not explicitly
	mentioned.
- The metadata tags like `author` do not have the be quoted explicitly, they
	are quoted implicitly.
- The metadata values like `Your mom` are always evaluated, so lists must be
	quoted.
- We do not have to put the period between tag and value.
- The content is automatically quasi-quoted, we can write symbols and lists
	without quoting them, and we can insert evaluated values by unquoting them.
- We can use tags inside the content by unquoting them.

As you can see from the `,(format ...)` form, we always have an escape hatch
that lets us use all of Scheme from within the DSL. Similarly, since the
`static-page` macro evaluates to a regular Scheme list we can use it from
within Scheme just like any other Scheme operator. This is what makes the DSL
embedded as opposed to an external DSL like Jinja.


## Implementation of the DSL

We know what we want to write, and we know what we want it to be transformed
into. The next part is actually writing the Scheme macro which will perform the
transformation. Here it is:

~~~scheme
(define-syntax-rule
  (static-page ((meta-tag meta-value)
                ...)
    content-expr
    ...)
  (let* ((meta-datum value)
         ...)
    (list
      (cons (quote meta-datum) meta-datum)
      ...
      (cons (quote content) (list (quasiquote content-expr)
                                  ...)))))
~~~

There is really nothing special going on here if you know how to write Scheme
macros. The metadata is bound inside a `let*` expression, that way I can use
them inside the content body. Note that the expansion evaluates to a regular
Scheme list, so I can treat the result just like any other value: assign it to
a variable, pass it as an argument, or export from a module. It just fits right
in with the rest of the language.


## Conclusion

The implementation of the entire DSL fits inside the palm of my hand. It might
seem laughable to even call it a DSL, but this is actually a really big deal.
This particular DSL is tailored to *my* personal use-case, it was designed
around how *I* write web pages. There is no way such a niche DSL would ever
make it into the language standard.

If creating a DSL required more effort it would not be feasible to create a DSL
that is going to be used by one person only for one project only. I would
either try to create something much more general (like Jinja) to make it worth
the effort, shoehorn the language's existing syntax into a quasi-DSL, or
just stick to glueing together lists by hand.

If Scheme did not have macros I would have had to use the syntax the language
offers me. I am sure you have seen weird code practices and patterns such as
the trainwreck (hypothetical example):

~~~java
new WebPageBuilder()
    .withTitle("My first web page")
    .withAuthor("Your mom")
    .withCSS("main.css", "home.css")
    .WithJS("sneaky-cryptominer.js", "bloated-framework-of-the-month.js")
    .withContent(
        new HTMLTag("h1", "This is a title"),
        new HTMLTag("p", "This is a paragraph"),
        new HTMLTag("ol",
            new HTMLTag("li", "first list item"),
            new HTMLTag("li", "second list item")
        ),
        new HTMLTag("p", "Written by 'Your mom'.")
    );
~~~

This is just a hypothetical example, and you might be able to come up with a
somewhat cleaner API, but why bother? If a language was not meant to express
web page medatada and HTML structure it will always be awkward. A true
AST-based macro allows me to bend the syntax rules of the language to my needs
instead.



[Pelican]: https://blog.getpelican.com/
[Jinja]: https://jinja.palletsprojects.com/
[Python]: https://www.python.org/
[GNU Guile]: https://www.gnu.org/software/guile/
