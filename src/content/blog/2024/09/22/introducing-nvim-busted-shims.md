---
title: Introducing nvim-busted-shims
category: vim
tags: testing, vim, lua
---

I have written in the past about [testing Neovim plugins with busted].  In that
post I outlined how to use a thin command-line wrapper shell script around
Neovim to use Neovim as a Lua interpreter and how to configure busted to use it
as the Lua interpreter to run tests in.  In order to avoid having to copy-paste
that snippet over and over again I have created a standalone repository for the
shim: [nvim-busted-shims] ([GitHub mirror]).

Using it is simple: you add it as a Git submodule to your repository, configure
busted to use the shim `lua` as the Lua interpreter, and that's it.  The README
has more details, a tutorial and a couple of handy recipes.


## Motivation

There are other test frameworks and helpers out there, so what makes this one
special?

- It piggy-backs on top of busted because busted is already well-established
  and works well, no need to re-invent the wheel
- The implementation is as minimal as possible, that way I can call it “done”
  and it will continue to work
- Users and contributors do not have to add any new plugins to their
  configuration
- Users do not need this submodule at all

Thanks to the minimal design there is really nothing new to learn.  If you
already know how to write busted tests you are good to go.  And if you do not
know busted, you can learn it and write the same kinds of tests for other uses
of Lua.

Being minimal also means that you probably want to add some helper plugins,
such as [yo-dawg].  This repo is not a case of “batteries included” but on the
other hand it means you can pick which helpers you want to use.  Helper plugins
can and should be added as submodules as well.  Again, the README contains more
details.


## More shims

There are three shims included:

- `lua` is a wrapper that uses Neovim as a Lua interpreter, this is what you
   want for your tests
- `busted` calls Luarocks first to pick the correct installation of busted in
  case  you have installed the package for different Lua versions, use this for
  running tests
- `nvim` is regular Neovim but running in an isolated environment, free from
  you personal plugin settings

The `nvim` shim is useful for running your plugin interactively.  Sometimes you
do not want to run a test but to try things out.


## Eating my own dog food

I have been using these shims for testing rainbow-delimiters.nvim, and the
`nvim` shim has been especially useful.  When a test fails I want to be able to
start up a regular Neovim with UI and see what is going on.  The `nvim` shim
ensures that my own settings are not affecting what I see.

Another use-case for the shims is having two copies of a plugin: one I want to
actually use, and one I am working on.  Previously I had to work on the one
plugin as I was using it in order to see the changes.  But now the worked-on
copy of the plugin can reside anywhere outside my configuration.  In order to
try it out I either write a test or I use the `nvim` shim to poke around.  All
the while the copy in active use remains unchanged.

I have since ported the tests in
[jinja.vim](https://gitlab.com/HiPhish/jinja.vim) to busted, and I will most
likely port other plugins as well.  I hope these shims can help other people
write well-tested plugins as well.



[testing Neovim plugins with busted]: /blog/2024/01/29/testing-neovim-plugins-with-busted/
[nvim-busted-shims]: https://gitlab.com/HiPhish/nvim-busted-shims
[GitHub mirror]: https://github.com/HiPhish/nvim-busted-shims
[yo-dawg]: https://gitlab.com/HiPhish/yo-dawg.nvim
