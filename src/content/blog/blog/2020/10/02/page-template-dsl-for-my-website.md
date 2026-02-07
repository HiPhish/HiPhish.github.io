---
title: A web page template DSL for my website
category: organisation
tags: lisp, html
---

In my [previous blog post] I presented how I had come up with an embedded
domain-specific language for creating web pages in my custom static site
generator. I also mentioned the concept of “templates” in passing. Of course it
was only logical to follow the page DSL up with a custom template DSL to smooth
over the code duplication and pattern repetition.


## What is a template?

A template is a function with takes one page as input and returns another page
as output. No side effects, no mutation, it is a pure function. In the previous
post we have seen that a page is simply an association list of metadata, so the
job of a template is to map that metadata onto new metadata. This also means
that templates can be chained by making the output of one template the input of
another template.

```
              ╔════════════╗    ╔════════════╗    ╔════════════╗
╭────────╮    ║            ║    ║            ║    ║            ║    ╭────────╮
│ input  │╴╴╴╴║ template 1 ║╴╴╴╴║ template 2 ║╴╴╴╴║ template 3 ║╴╴╴╴│ output │
│ page   │    ║            ║    ║            ║    ║            ║    │ page   │
╰────────╯    ╚════════════╝    ╚════════════╝    ╚════════════╝    ╰────────╯
```

This pipeline of templates turns a specialised page, such as a blog post,
progressively into a more and more general page. With each iteration the
`content` of the page keeps growing: the template takes some of the page's
other metadata, such as the name of the author, and turns it into HTML which is
then combined with the existing content. The final page then has a complete
HTML tree as its content.


## Look inside a template

Here is the raw template for generating the articles listing for a specific
category.

```scheme
(define (category data)
  (define blog     (assq-ref page 'blog    ))
  (define category (assq-ref page 'category))
  (define posts    (assq-ref page 'posts   ))
  (define page     (assq-ref page 'page    ))

  (let ((breadcrumbs
         `(((title . ,(assq-ref blog 'top))
            (url   . "../../"))
           ((title . "categories")
            (url   . "../"))
           ((title . ,(assq-ref category 'title)))))
        (content
          ;; articles-list is a helper function
          (articles-list posts (if (= page 1) "../../" "../../../"))))
    (cons* (cons 'breadcrumbs breadcrumbs)
           (cons 'content     content    )
           data)))
```

There is a lot of code duplication here. As the spacing might imply, there are
three stage in each template:

1) Bind existing data from the input to variables so we can use it later
2) Define new data, potentially using the above bindings
3) Return the new data


## The template DSL

The first phase only needs the names of the bindings, everything else is just
repetition. The second phase needs the new bindings and their values. The third
phase can be entirely derived from the second one, so we should not have to
write it out. Here is the result:

```scheme
(define category
  (template (blog category posts page)
    (breadcrumbs
      `(((title . ,(assq-ref blog 'top))
         (url   . "../../"))
        ((title . "categories")
         (url   . "../"))
        ((title . ,(assq-ref category 'title)))))
    (content
      (articles-list posts (if (= page 1) "../../" "../../../")))))
```

The `template` macro expands into a `lambda` expression. The bindings are now
all next to each other at the beginning without any visual noise between them.
The new data is given as a sequence of key-value pairs in the body of the
template. All the mandatory quoting of symbols is now implicit, we can never
forget to quote. The values are regular Scheme expressions, so we still have
the same power as before.


## Implementation of the DSL

The macro of the template DSL is just as simple as the one for the page DSL.

~~~scheme
(define-syntax-rule
  (template (binding ...)
    (field-expr value)
    ...)
  (λ (data)
    (define binding (assq-ref data (quote binding)))
    ...
    (let ((field-expr value)
          ...)
      (cons*
        (cons (quote field-expr) field-expr)
        ...
        data))))
~~~

There is not much to say here, it is a 1:1 translation of the above code into a
macro. Since the result of the expansion is just a regular Scheme function I
can use templates wherever I can use functions as well.


## Conclusion

The purpose of a DSL is twofold: it allows us to express our intention more
directly, and it allows us to avoid errors by missing the forest from all the
trees. However, coming up with a good DSL can be hard when starting out: it is
easy to design the language to be too broad and general, or design it too small
and having to constantly reach back to the host language.

For this reason I prefer to instead write the code out manually first. As I
keep writing the code patterns will emerge. I will be able to learn what I need
and what I do not need from a DSL and design it accordingly. Both DSLs were
designed over a year and a half after having written this static site generator
when I already had enough experience writing pages and templates. Of course not
every project can afford to delay the design of a DSL *this* long, but the
point is to first let the software grow organically and observe what works and
what does not before setting it in stone.

This is only practical because Lisp's macro system is so flexible; I was able
to try out different approaches and throw them away without much thought.
There was no need for a planning session, I just started hacking away and the
pieces fell into place on their own. You could say that I did not actually
create the DSLs, I instead grew them out of the old code.


[previous blog post]: /blog/2020/09/28/page-dsl-for-my-website/
