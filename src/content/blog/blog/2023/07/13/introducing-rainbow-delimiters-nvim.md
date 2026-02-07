---
title: Introducing rainbow-delimiters.nvim
tags: vim
category: vim
---


Wait what, again? Yes, another rainbow delimiter plugin, a fork of a fork. The
previous one [nvim-ts-rainbow2] was built as a module for [nvim-treesitter]
because that is what the original plugin did and what everyone else was doing.
However, nvim-treesitter [is deprecating] the module system.  This means
nvim-ts-rainbow2 will eventually stop working, so we will need a new rainbow
plugin sooner or later anyway.

The way the module system works was giving me more problems than it was solving
anyway, and most of the helper functions now have proper corresponding Neovim
functions, so there is no reason to depend on nvim-treesitter anyway.
Currently the old plugin works just as well as it used to so far, but
development will continue only in rainbow-delimiters.nvim from now.

The official Repo is on GitLab:
[https://gitlab.com/HiPhish/rainbow-delimiters.nvim](https://gitlab.com/HiPhish/rainbow-delimiters.nvim)

There is also a GitHub mirror for those who prefer it:
[https://github.com/HiPhish/rainbow-delimiters.nvim](https://github.com/HiPhish/rainbow-delimiters.nvim)

As usual, if you want to contribute or file an issue you can use either
service, the GitHub mirror is synchronized with the main repository.


## What has changed

Not much really.  The main difference is that the configuration is now
specified as a regular variable `g:rainbow_delimiters`.  The options are mostly
the same.  You can still set the query and strategy separately for each file
type and you get the same queries and strategies as before.  The same languages
are supported as before.

The biggest user-facing change is that the default query name is now
`rainbow-delimiters`.  Delimiters are usually parentheses, but for some
languages like HTML, Vue or JSX (Javascript with embedded HTML-like tags) this
notion does not make any sense, so it makes sense to make tags the default
delimiters.  Hence the generic name for the default query.  And yes, this means
React support should now be sane out of the box.

As always you can find the full details in the included manual.


## Future plans

The plugin is ready for use.  There are some issues left to iron out, but those
are issues present in the original plugin as well.  Dropping nvim-treesitter
has already given me some improvements, so there is no reason to hold on to the
old plugin.


[nvim-ts-rainbow2]: https://gitlab.com/HiPhish/nvim-ts-rainbow2
[nvim-treesitter]: https://github.com/nvim-treesitter/nvim-treesitter
[is deprecating]: https://github.com/nvim-treesitter/nvim-treesitter/issues/4767
