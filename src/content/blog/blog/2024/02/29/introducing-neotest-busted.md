---
title: Introducing neotest-busted
category: vim
tags: vim, testing
---

The conclusion of the Neovim & Busted testing sage is coming to a close with
this new plugin: [neotest-busted] ([GitHub mirror]).  In my [previous post] I
mentioned that that I wanted to write a [Neotest] adapter for the [busted] test
framework, so here it is.

![Screenshot of Neovim with Neotest summary window open](https://github.com/HiPhish/neotest-busted/assets/4954650/4ca74545-ca95-4e0b-ad32-b8d89c51b4f5)

And yes, I am using the plugin to test itself.  It was quite thrilling when I
finally started seeing these green checkmarks.


## Features

This is as close to a no-configuration plugin as possible.  Everything should
work out of the box once you have the adapter registered in Neotest.

- Auto-detects configuration (`.busted` file)
- Reloads configuration on change
- Uses `vim.secure` for confirmation before executing the configuration file
- Support for custom busted binary (`g:bustedprg`) and configuration file
  (`g:bustedrc`)
- Watch test files and execute them automatically on changes

Debugging is still missing for now.  It should be easy to add (famous last
words), but I wanted to focus on getting testing right first because running
tests is a prerequisite for debugging them.


## Lua is different

The tricky part with Lua is getting a script to run in the first place.  Lua is
an embedded language, which means that our scripts normally run inside another
program.  Even the standalone Lua interpreter is just thin layer on top of the
Lua C library.  This raises a problem: how can I run just this one script I
want to test?

The answer is “it depends”.  With Neovim we can use the `-l` command-line
option and write a short command-line adapter to use Neovim the way we would
use the standalone interpreter.  This raises another issue though: with all
these hacks and tricks and adapters on top of adapters, how do I know which
part of the chain is broken if things don't work?

This is why I have added a collection of recipes to the manual of
neotest-busted.  They guide the reader from the simplest possible test scenario
(a standalone Lua script) up to testing Neovim plugins, complete with a
copy & paste ready command-line adapter.

I would like to extend the recipes over time with other applications like
[LÖVE] (if this is even possible) or other languages like [Fennel] and
[Moonscript].  Let us bring testing goodness to other parts of the Lua
ecosystem as well.


## Closing thoughts and an appeal

I am glad this plugin has been written, I just wish it hadn't been me who had
to write it.  There is a big elephant in the room and I have to address it:
documentation.  Both Neotest and busted have very sparse documentation when it
comes to integration.  Neotest is mostly a machine-generated dump of its API,
and while busted does have a good user manual, the schema of the JSON output is
not documented anywhere.  I had to spend a lot of time reading source code,
`print`ing intermediate values, collecting samples, and making good
old-fashioned educated guesses.  There are probably still some edge cases that
are wrong and only time will uncover them.  I am not saying this to shit on
Neotest or busted specifically, it is a recurring problem and these two just
happend to be the latest instance of it.

This was very frustrating and time wasting. I don't like to bring my personal
issues into these posts, but I think in this case it is warranted. Honestly, if
I had not been laid off recently I don't think I would have had the patience or
energy to power through it.

This is a problem.  If we want to build up a healthy Neovim ecosystem we cannot
rely on unemployed programmers to have the time to dig into other people's
code.  Good documentation written *in prose* is a huge time-saver because the
integrator can focus on implementing the protocols according to spec instead of
having to find out what the spec even is.

The only person who can write proper documentation is the original author (or a
dedicated technical writer, but I doubt small-scale projects have one).  The
author is the only one who knows what the code is *intended* to do, everyone
else has a chance of misunderstanding the intention.  I could go into what
makes for good documentation, but the [Diataxis] concept already describes it
perfectly, it is pretty much what I would have written if I had written it.
The Vim manual is an example of great documentation that matches this concept.
Of course not all points apply to all software projects (you don't need a
tutorial for a colour scheme), but it does make for a good guideline.

So here is my appeal to plugin authors: please put more effort into
documentation.  If you have difficulty explaining something, how much harder
will it be for someone else to understand it?


[neotest-busted]: https://gitlab.com/HiPhish/neotest-busted
[GitHub mirror]: https://github.com/HiPhish/neotest-busted
[previous post]: /blog/2024/02/20/debugging-lua-scripts-running-in-neovim/
[Neotest]: https://github.com/nvim-neotest/neotest/
[busted]: https://lunarmodules.github.io/busted/
[LÖVE]: https://love2d.org/
[Fennel]: https://fennel-lang.org/
[MoonScript]: https://moonscript.org/
[Diataxis]: https://diataxis.fr/
