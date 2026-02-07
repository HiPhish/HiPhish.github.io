---
title: A new static site generator
category: organisation
tags: lisp, html, web
---

In January 2019 I switched the static site generator for this website from
[Pelican] to a custom one written in [GNU Guile]. Most (or all?) static site
generators out there have an opinion on what a website should be made of. You
might have full control over the layout and content of individual pages, but
not so much over how the web site itself is composed. Writing my own static
site generator freed me from these constraints. Now if I want to have sub-sites
and multiple blogs I can do so. However, the custom generator was suffering
from the same problem: it had one specific web site composition in mind, it
just happened that this time it fit my needs. That is why I have created
[HSSG]: the Hackable Static Site Generator.


## HSSG

HSSG is not really a static site generator in the general sense where you just
create a directory structure, fill it with Markdown files, call a command from
the shell and get a ready to publish website built. You could of course build
such a generator on top of HSSG if you wanted to though.

HSSG is essentially a Common Lisp library and every website is its own Common
Lisp project which depends on HSSG. It is up to the author to structure and
orchestrate how the website is built, HSSG provides the abstractions to turn
high-level concepts like a "web page", an "asset directory" or a "blog" into
actual files.

The two core concepts are "artifacts" and "templates". An artifact is a CLOS
object which implements the artifact protocol; currently there is only one
method `WRITE-ARTIFACT` which produces an output file, but new methods can be
added. An artifact can be a single page, a verbatim file, or a higher level
artifact like a compound artifact.

```lisp
;;; Representation of a simple web site as one compound artifact
(defvar *my-website*
  (hssg:make-compound-artifact
    (make-html-artifact
      #'page-template
      (hssg:static-page ((:title  "Home")
                         (:css "main.css")
                         (author :author "Your mum"))
        '(:h1 "My first website!")
        `(:p ,(format nil "Hello world! I am ~A." author))))
    (make-verbatim-artifact
      #p"content/main.css")
    (make-directory-artifact
      #p"content/img/")))

;;; Write the website
(hssg:write-artifact *my-website*)
```

The entire website is one giant artifact which contains other artifacts.
Writing the website artifact writes the child artifacts. We also see a small
DSL for expressing the content of an HTML page. The HTML page needs a template
to compile the high-level data into a low-level representation of the HTML
page.

A template is a Common Lisp function which transforms one association list into
another. There is a DSL which makes it easy to define templates.

```lisp
(deftemplate page-template (title author css)
  (:content
    `(:html
       (:head
         (:title ,title)
         ((:link :rel "stylesheet" :href ,css :type "text/css" :media "all")))
       (:body
         ,@content
         (:footer
           (p ,(format nil "By ~A" author)))))))
```

Here we can see how the final content is represented as a tree s-expression
with parameters spliced in. The `CONTENT` variable is special, it is always
implicitly declared and represents the data to compile to HTML. The content
does not have to be final like it is here, we can chain multiple templates and
have each one progressively build up the content.

The API will change in the future, this is just an example for how.


## Common Lisp VS Guile Scheme

Guile is an implementation of the Scheme language, while Common Lisp is a
language standard with multiple implementations. In theory Scheme too is a
language with multiple implementations, but in practice Scheme is so barebones
that every implementation ends up being its own language and they just share a
common core. So unless your program is a little toy example, it will be tied to
one particular Scheme implementation.

Guile is a nice implementation, it has a very large library of included modules
and is reasonably fast for making a static site generator in. This large
library is what allowed me to write the first static site generator in a few
days completely from scratch and it was definitely the right choice at the
time.

However, Guile has practically no ecosystem at all. There is no package
manager, no build system, no dependency management. People have adopted [GNU
Guix] as the de-facto package manager, which works well enough. As for a build
system, usually a generic build system like the GNU autotools is used. None of
this was an issue for a bespoke static site generator, but for a reusable
static site generator I fear the lock-in to one implementation and its crummy
ecosystem could become a burden.

Common Lisp in contrast has a larger ecosystem of implementations, libraries
and a de-facto standard build system and package manager. With that said,
unfortunately the quality of the library ecosystem can be pretty miserable at
times. While the code itself might be fine, there is no versioning scheme, poor
documentation and issues remain unanswered for years. It is like wandering
through a wasteland and occasionally stumbling upon an abandoned but functional
shelter built years ago by another lonely wanderer. This is such a stark
contrast to other language ecosystems, which are either completely dead or
completely lively.

As for the languages themselves, Scheme is lean and beautiful, while Common
Lisp is a Frankenstein monstrosity stitched together from the corpses of now
dead Lisp dialects. I still don't get the benefit of splitting functions and
values into two namespaces. On the other hand, all the things that Scheme is
missing and which need to be added by the implementations in a non-portable
way, Common Lisp has them either in the standard or as a portable library.


## What makes HSSG so hackable?

As I mentioned previously, HSSG is more of a library than an application. What
a static site generator does at its core is take in some structure, such as a
directory path, and output a directory with all the generated files. HSSG
exposes the building blocks for a web designer to specify the entire
transformation process in code. Think of it a bit how in modern OpenGL
programming you have to write the shaders which will process the geometric data
to actually generate the pixels on screen.


### The data pipeline

The data pipline consists of three parts: the source, a template, and an
artifact. The source generates the data in its raw high-level form. For
example, we could write a single static page as a Markdown file and the source
would read this file and return a tree-like s-expression.

Next, the data is passed through a template. A template transforms the data
from one form to another. Take for example a blog post: at a high level it
consists of the content and metadata such as the author, category or date of
publication. This is a very high-level view, we cannot convert it to HTML as it
is. Instead a template will generate another s-expression which represents the
structure of the HTML document. Here is where it gets interesting: templates
can be chained. You blog post is part of a blog, so we need to wrap it inside
the navigation elements common to all blog pages. The blog itself might be part
of a sub-site, so we need to take the output of the blog page template, pass it
to the sub-site template which wraps the content inside the header and footer
of the sub-site, then we pass that output to another template which wraps that
content into the global header header and footer. Chaining multiple templates
produces a new compound template, so as far as the pipeline in concerned there
is always only one template.

Finally we have artifacts. An artifact writes the output file depending on the
type of artifact. We can have compound artifacts which wrap other artifacts.
The artifact thus captures the structure of the final website as it will be
written.


### Extensibility

Since HSSG is a library we can write other libraries on top of it. A blog is a
very complex component of a website with its own dependencies that not all
websites need. There is no reason to include such a feature in the core of
HSSG, so blogging is a separate system the website needs to depend on.

The flexible data pipeline makes it very easy to add new components to HSSG.
These can be large and reusable like a blog, or small and one-off additions
specific to one website. In my case I have a number of [examples] for [Grid
Framework] where each example page is represented by a custom artifact.

```lisp
(defclass grid-framework-example-artifact ()
  ((gf-example-name :initarg :name
                    :documentation "Name of the directory where the example is stored.")
   (gf-example-path :initarg :path
                    :documentation "Path to the example, relative to content directory")
   (gf-example-initial-data :initarg :initial))
  (:documentation "A playable example of Grid Framework"))

(defmethod hssg:write-artifact ((artifact grid-framework-example-artifact))
  (with-slots ((name gf-example-name)
               (path gf-example-path)
               (initial gf-example-initial-data)) artifact
      (let ((index.html (read-html-lisp
                          (format nil "content/~A/~A/index.html.lisp" path name)
                          (format nil "output/~A/~A/index.html"       path name)
                          :template (lambda (data)
                                      (base-page (page (grid-framework-example data))))
                          :initial initial))
           (assets (mapcar (lambda (fname)
                             (make-verbatim-artifact
                               (format nil "./~A/~A/~A" path name fname)
                                           #p"content"
                                           #p"output"))
                           '("example.asm.jsgz" "example.datagz" "example.jsgz"
                             "example.memgz" "UnityLoader.js"))))
        (hssg:write-artifact
          (apply #'hssg:make-compound-artifact (cons index.html assets))))))
```

This is the entire implementation. Note that it uses the primitive artifacts
provided by HSSG as building blocks. The implementation of `WRITE-ARTIFACT`
delegates to the implementation of `COMPOUND-ARTIFACT`.


### Data pipeline not just for HTML

Currently the data pipeline only supports generating HTML, but it is easy to
extend it to generate other files like CSS. This means we could define a colour
palette as a global Lisp variable and generate CSS files which always have the
correct colours. We could hook up something like [Parenscript] and generate
Javascript from Lisp.


### ASDF as the build system

Since HSSG is a library an every website is a Lisp project we can make use of
ASDF as our build system. This gives us the entire hackability of ASDF for
free. Generate a web site for development, for publishing, start a local web
server, add your entire publishing workflow. If you already know ASDF well then
there is nothing more to learn, and if you do not then you can learn a skill
that will be applicable outside HSSG as well.


## Future plans

For now the public API of HSSG is anything but stable. I will have to use it
more to identify weak points in the design and find out what works and what
does not, find out what is missing and what is superfluous. I hope that one day
HSSG can become a staple project in the Common Lisp ecosystem, but that
requires a design that is useful for many people and easy to extend.

The first step will be to get [cl-cmark] to version 1.0 and submit it to
Quicklisp. Then the API of HSSG itself needs to settle; I have already
identified a number of things to change even while writing this post.


[Pelican]: https://getpelican.com/
[GNU Guile]: https://www.gnu.org/software/guile/
[HSSG]: https://gitlab.com/HiPhish/cl-hssg
[GNU Guix]: https://guix.gnu.org/
[examples]: https://hiphish.github.io/grid-framework/examples/
[Grid Framework]: https://hiphish.github.io/grid-framework/
[Parenscript]: https://parenscript.common-lisp.dev/
[cl-cmark]: https://gitlab.com/HiPhish/cl-cmark
[Quicklisp]: https://www.quicklisp.org/beta/
