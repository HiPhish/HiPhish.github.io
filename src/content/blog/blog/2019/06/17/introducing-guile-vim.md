---
title: Introducing Guile.vim
category: vim
tags: lisp, vim
---

Vim has good support for Scheme, but the problem with Scheme is that every
implementation adds its own features to the language. My [guile.vim] plugin
aims to improve support for [GNU Guile] by augmenting these settings. It can
attempt to detect when a Scheme file is Guile-specific and it adds syntax
highlighting for Guile-specific forms.

Detection works similar to that of [Geiser]: it scans the source code for a
Guile shebang, a use of `define-module`, or a use of `use-modules`. If Guile
was detected the file type is augmented by appending `.guile` to it. This part
is important because it means that your buffer is both of type `scheme` and of
type `guile`. All your settings and plugins for Scheme will still work. This
dotted file type feature is documented under `:help 'filetype'` in Vim (note
the single quotation marks, this is an option).

[guile.vim]: https://gitlab.com/HiPhish/guile.vim
[GNU Guile]: http://www.gnu.org/software/guile/
[Geiser]: https://www.nongnu.org/geiser/
