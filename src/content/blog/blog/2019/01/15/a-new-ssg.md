---
title: A new static site generator
category: organisation
tags: lisp
---

Over two years already without rewriting the workshop? I have to rectify this,
with the greatest rewrite yet! I have abandoned Pelican because I constantly
had to adjust things manually after the build process, and even then there were
parts of the website that weren't working. This put me off from blogging, since
after each post I would have to stitch everything back together by hand. Seeing
that no static site generator would be able to meet my needs I decided to
instead write my own in Scheme.


## The problem with Pelican and SSGs in general

I have been using [Pelican](https://blog.getpelican.com/) in the past, and it
is a good program if all you want to have is a blog with a few static pages.
This is true for static site generators in general, they are written with
certain assumptions about their use in mind. And if that is all you need they
will serve you well.

My problem was that I wanted to do things My Way™, and so I found myself
fighting the solution rather than the problem. Pelican's authors never intended
users to want to have sub-sites or multiple blogs. There is a way of writing
plugins for Pelican, but all one can do is hook up into the pipeline and
re-route the data before sending it back to the pipeline. What I wanted was a
way to build my own pipeline from scratch.


## GNU Guile and SXML

[GNU Guile] is an implementation of Scheme, and the official extension language
of the GNU project. I originally encountered it while working my way through
[SICP], and although I eventually settled with [Racket] for SICP I always
wanted to make something useful in Guile as well.

Unlike the minimalist nature of Scheme's specification, Guile comes with
everything and the kitchen sink included. I will let the reader be the judge on
whether that's a good thing or not, but it allowed me to write my own static
site generator, something I am not sure I would have dared to do in a language
like Python.


### A templating engine

One of the libraries it includes is for dealing with SXML expressions. An SXML
expression is basically a Lisp s-expression which represents an XML expression
tree. It is outside the scope of this blog post to go into detail, but it
suffices to say that I get a templating language essentially for free.

~~~scheme
;; Some content we will splice in, it is a paragraph containing a link
(define content
  '(p
     "Hello world, here is a "
     (a (@ (href "http://example.com/"))
       "link")
     "."))

(define (html-page title content)
  "Produce a complete HTML page"
  `(html
     (head
       (title ,title))
     (body
       ,content)))
~~~

The above code snippet defines a templating procedure (`html-page`) which takes
two arguments: a string for the page title and an SXML expression for the
content. Both arguments are then spliced in using the comma (called an
`unquote` in Lisp). Here is where it gets really cool: the unquote does not
just let us splice in variables, we can splice in the return value of *any*
Scheme code.  [Jinja] had to awkwardly pull in a subset of Python into its
system, but here it all just works out of the box as part of the language.

With the templating system out of the way, all that was needed was to tie
everything together. And since I am fully in control of the generation process,
I can add anything to it I want. I might eventually decide to use a CSS
preprocessing system, and it is easy to add it to the generation system (by
shelling out to its binary).


### Other helpful tools

Guile alone got me 90% of the way, and the other 10% I "stole" from [Haunt].
Haunt is a static site generator written in Guile, but it has the same
"limitations" as other SSGs. I used it as a library, making use of its local
server for testing and its reader for [Commonmark].


## The sky is the limit

With the heavy baggage of a pre-existing SSG out of way I can finally focus on
the content again. Getting rid of [Bootstrap] and [jQuery] is on the to-do
list. I might also get back into the habit of blogging about my software
projects again, now that I can push posts withot breaking fifty things in the
process. I do miss being able to write blog posts in [reStructuredText]
(converting them all to Commonmark was what took the most time), but I don't
think I'll by able to write a parser anytime soon in Scheme. Oh well, I'll
manage to get by somehow, I can still write posts in Scheme if everything else
fails.

The link to the repo with the source code can be found on on the
[about](/about/) page.



[GNU Guile]: http://www.gnu.org/software/guile/
[SICP]: https://mitpress.mit.edu/sites/default/files/sicp/index.html
[Racket]: https://racket-lang.org/
[Jinja]: http://jinja.pocoo.org/
[Haunt]: https://dthompson.us/projects/haunt.html
[Commonmark]: https://commonmark.org/
[reStructuredText]: http://docutils.sourceforge.net/docs/ref/rst/introduction.html
[Bootstrap]: https://getbootstrap.com/
[jQuery]: https://jquery.com/
