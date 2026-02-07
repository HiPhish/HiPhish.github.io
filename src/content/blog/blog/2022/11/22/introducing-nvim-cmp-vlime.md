---
title: Introducing nvim-cmp-vlime
category: open-source
tags: lisp, vim
---

I am glad to announce a new Neovim plugin: [nvim-cmp-vlime] ([GitHub mirror]).
It is a completion source for [nvim-cmp] which uses the [Vlime] plugin to fetch
completion candidates from a running Common Lisp process. Vlime is a plugin
similar to [Slime] for Emacs, it lets the editor communicate with a running
Lisp process so we can evaluate code at runtime, debug, inspect values, and of
course get auto-completion. In fact, Vlime uses the same Backend, Swank, as
Slime, so the results should be equally good.

While I was at it I decided to try something novel: the changelog is part of
the documentation. Run `:h cmp-vlime-changelog` to open the changelog from
within Neovim. The changelog is a simple Vim help file, so all the syntax
highlighting and key mappings will work. Here is a small excerpt:

```
*cmp-vlime-changelog.txt*	Changelog for |cmp-vlime|


                                                         *cmp-vlime-changelog*
All notable changes to this project will be documented in this file.  The
format is based on Keep a Changelog and this project adheres to Semantic
Versioning.

Keep a Changelog:
  https://keepachangelog.com/en/1.0.0/

Semantic Versioning:
  https://semver.org/spec/v2.0.0.html



==============================================================================
Version 0.4.0                                                *cmp-vlime-0.4.0*
Released 2022-11-22

Added~

  - Documentation for completion items based on docstring
  - Changelog included in manual (|cmp-vlime-changelog|)

Fixed~

  - Place two spaces between sentences in documentation



==============================================================================
Version 0.3.1                                                *cmp-vlime-0.3.1*
Released 2022-11-21

Fixed~

  - Removed dummy information from completion items
```

There are a couple of thing to note:

- The `gO` combo populates the location list with all version numbers so we can
  jump to a particular version directly
- We can use references like `|cmp-vlime-changelog|` to jump to other manuals
- Each release has a tag like `*cmp-vlime-0.3.1*` so we can jump to it directly
  with `:h cmp-vlime-0.3.1` or reference it within a manual like
  `|cmp-vlime-0.3.1|`.
- The help index (`:help`) will reference the changelog

I think it's a pretty cool idea and I would like to adopt it in other plugins
as well.


[nvim-cmp-vlime]: https://gitlab.com/HiPhish/nvim-cmp-vlime
[GitHub mirror]: https://github.com/HiPhish/nvim-cmp-vlime
[nvim-cmp]: https://github.com/hrsh7th/nvim-cmp/
[Vlime]: https://github.com/vlime/vlime
[Slime]: https://slime.common-lisp.dev/
[completion.nvim]: https://github.com/nvim-lua/completion-nvim
[ncm2-vlime]: https://gitlab.com/HiPhish/ncm2-vlime
[completion-nvim-vlime]: https://gitlab.com/HiPhish/completion-nvim-vlime
