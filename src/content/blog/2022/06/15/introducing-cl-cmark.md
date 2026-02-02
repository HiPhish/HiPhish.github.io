---
title: Introducing cl-cmark
tags: lisp, markdown
category: open-source
---

For the past few weeks I have been working on a little side project, a library
of Common Lisp bindings to [cmark], the [CommonMark] reference implementation:
[cl-cmark] ([GitHub mirror]).
CommonMark is a dialect of Markdown which aims to remove any ambiguity, clean
up the language specification and provide a common dialect of Markdown for
other projects to use. The cmark library is the reference implementation for
parsing CommonMark. It is written in C, so creating bindings for other language
is fairly simple.

The project is very much feature complete and tested, but I have yet to write
the manual and declare the API stable. Users can use cl-cmark to parse
CommonMark text into a tree of nodes and traverse that tree. Here is a small
example from the readme:

```lisp
(defpackage #:cmark-user
 (:use #:cl #:cmark))
(in-package #:cmark-user)

(defvar *document-tree* (cmark::parse-document "Hello *world*!")
 "Parse the document into a tree of nodes")

(defun print-node (node &optional (level 0))
 "Recursively print each node and its children at progressively deeper
 levels"
 (format t "~&~A~A"
         (make-string (* 2 level) :initial-element #\Space)
         (class-name (class-of node)))
 (dolist (child (cmark::node-children node))
   (print-node child (1+ level))))

(print-node *DOCUMENT-TREE*)
```

This produces the following output:

```
DOCUMENT-NODE
  PARAGRAPH-NODE
    TEXT-NODE
    EMPH-NODE
      TEXT-NODE
    TEXT-NODE
```

There are actually two systems in the repository: `libcmark` and `cmark`. The
`libcmark` system is mostly a low-level 1:1 binding to the C library; most
users should never have to use it, but one could build a custom high-level
lispy system on top of it. The `cmark` system is what most users should use, it
an provides idiomatic lispy API that hides the gory details of C and is built
on top of `libcmark`.

For now the project is not yet in [Quicklisp], but it is very light on
dependencies (only on [CFFI] and [flexi-streams]). Once I reach version 1.0 I
will see to it that I add for formal request for inclusion in Quicklisp.



[cl-cmark]: https://gitlab.com/HiPhish/cl-cmark
[GitHub mirror]: https://github.com/hiphish/cl-cmark
[cmark]: https://github.com/commonmark/cmark
[CommonMark]: https://commonmark.org/
[Quicklisp]: https://www.quicklisp.org/
[CFFI]: https://cffi.common-lisp.dev/
[flexi-streams]: https://edicl.github.io/flexi-streams/
