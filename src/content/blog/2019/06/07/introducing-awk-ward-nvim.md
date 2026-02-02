---
title: Introducing Awk-ward.nvim
tags: vim, awk
---

In order to make writing Awk scripts easier I have written a new Neovim plugin:
[Awk-ward.nvim] ([GitHub mirror]). This plugins allows you to edit an Awk
script or its input, and see the output live as you are making changes.

Awk requires two inputs: the program itself and some data to operate on, which
makes it unsuitable for the usual REPL approach where one types an expression
and sees only that expression evaluated. Awk programs usually run over a large
set of data instead, so a new type of interaction plugin was needed. Awk-ward
can use both an on-disc file or a Neovim buffer as input.

The plugin is fairly complete for what it does, but I am always open to
suggestions.

[Awk-ward.nvim]: https://gitlab.com/HiPhish/awk-ward.nvim
[GitHub mirror]: https://github.com/HiPhish/awk-ward.nvim
