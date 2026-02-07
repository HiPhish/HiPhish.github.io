---
title: Introducing Quicklisp.nvim
category: vim
tags: lisp, vim
---

One of the new features of [Neovim] is its ability to write plugins in any
programming language, provided that there is a plugin host available. I have
wanted to play around with the [Common Lisp host] for a while, and I like for
something useful to come out of it in the end, so I created [Quicklisp.nvim], a
plugin which allows users to manage Common Lisp libraries from inside Neovim.


## Overview

Everything is explained in detail in the included documentation, so I will only
provide a broad overview of the functionality. The one command provided is
appropriately named `:Quicklisp`. It takes one mandatory argument, which is the
sub-command to perform, followed by arguments to that sub-command if necessary.

Let's say we want to install a library. In Quicklisp we would type out
`(ql:quickload "cl-ppcre")` in the Lisp REPL. In Neovim we would then execute
the command `:Quicklisp quickload cl-ppcre` and the result would be printed in
the message area.

~~~
┌────────────────────────────────────────────────┐
│;; Contents of buffer...                        │
│~                                               │
│~                                               │
│~                                               │
│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│To load "cl-ppcre":                             │
│  Load 1 ASDF system:                           │
│    cl-ppcre                                    │
│; Loading "cl-ppcre"                            │
│                                                │
│Press ENTER or type command to continue         │
└────────────────────────────────────────────────┘
~~~

All the other sub-commands also follow the same rules as in Quicklisp, so if
you know how to use Quicklisp you also know how to use Quicklisp.nvim.


## How it works

I have already hinted in the opening paragraph at the fact that Quicklisp.nvim
is entirely written in Common Lisp. Unlike most package managers, Quicklisp
does not have a command-line interface, users are expected to call the
Quicklisp functions from the Lisp REPL. This also means that it is possible to
use Quicklisp as a Lisp library.

Let use look at the `quickload` function as an example.

~~~lisp
(defun quickload (system-names)
  (declare (type list system-names))
  "Quick-loads systems from the list SYSTEM-NAMES, echo output in Neovim."
  (dolist (system-name system-names)
    (declare (type string system-name))
    (nvim:out-write
      (format nil "~A~&"
              (with-output-to-string (*standard-output*)
                (with-output-to-string (*error-output*)
                  (ql:quickload system-name)))))))
~~~

This is the code that gets actually executed when the user executes `:Quicklisp
quickload`. Most of the code is just using the Neovim API to redirect the
output of Quicklisp back to Neovim instead of writing to the terminal.

This function also exposes some deficiencies in Quicklisp and Neovim. Quicklisp
lacks an official API, I had to dig through the source code to find out what is
possible and what is not. It would have been nicer if there was a documented
back-end API for people who want to build their own tools on top of Quicklisp.

As for Neovim, the `out-write` API method of Neovim cannot stream text. Instead
I have to wait until `ql:quickload` terminates. If the user executes a command
that takes a while to finish, it will look like the editor is frozen, and then
all the output will be vomited on screen at once. The usual solution is to
create a read-only buffer and stream the text into the buffer instead. I could
have done that, but I wanted to just get this plugin out of the door. Adding a
buffer-based interface can be done at any time without much refactoring.

Other than that, it was a very pleasant experience to write a Neovim plugin in
Lisp. Thanks to the API I did not feel any "vimisms" while writing, everything
was very well integrated in the Lisp way.



[Neovim]: https://neovim.io/
[Common Lisp host]: https://github.com/adolenc/cl-neovim/
[Quicklisp.nvim]: https://gitlab.com/HiPhish/quicklisp.nvim
