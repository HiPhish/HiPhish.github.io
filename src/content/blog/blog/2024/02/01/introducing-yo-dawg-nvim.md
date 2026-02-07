---
title: Introducing Yo-Dawg.nvim
category: vim
tags: neovim, lua
---

Yo dawg, I heard you like Neovim, so I put a Neovim inside your Neovim, so you
can edit while you edit!  Ahem... anyway, in my [previous post] I proposed a
plugin which would make it easier to control an embedded Neovim from within
Neovim.  So I went ahead and wrote [yo-dawg.nvim] ([GitHub mirror]), named
after the “Yo dawg” internet meme.

Why would you need a plugin like this?  Well, you really don't, Neovim provides
all the tools you need, but if you find yourself starting Neovim processes and
sending them messages over and over again the boilerplate code can add up very
quickly.  Let's take a look at an example from the manual.  Here is what a
minimal session looks like using the stock Neovim API:

```lua
-- Start the process
local cmd = {'nvim', '--embed', '--headless'}
local nvim = vim.fn.jobstart(cmd, {rpc = true})

-- Call an API method
local value = vim.rpcrequest(nvim, 'nvim_eval', '1 + 2')

-- Gracefully terminate the process
vim.rpcnotify(nvim, 'nvim_cmd', {cmd = 'quitall', bang = true}, {})
vim.fn.jobwait(nvim)
```

Now let's see what it looks like with yo-dawg:

```lua
local yd = require 'yo-dawg'

-- Start the process
local nvim = yd.start()

-- Call an API method
local value = nvim:eval('1 + 2')

-- Gracefully terminate the process
yd.stop(nvim)
```

Much simpler and less noisy.  We only need to spell out what really matters.
Sure, if you only need to spin up a process once in a blue moon it might not be
worth pulling in an extra plugin, but when writing tests you need to spin up a
new process for each individual test.

The plugin is purely a library, there is nothing to configure, no new commands,
no new mappings.  The `start` function returns a handle to a new Neovim
process, the `stop` function gracefull quits the process.  You can call any
API method as a method of the handle, the names are the same minus the `nvim_`
prefix.  And the best part is that we are forwards compatible: thanks to
metatable magic any new API method will be supported automatically.

I have gone ahead and added it as a test dependency to
[rainbow-delimiters.nvim] and it has really improved the readability of my
tests.  You could say I was eating my own “dawg food”. I will definitely be
using it in further tests for other plugins and I hope other people find it
useful as well.  Who knows, maybe you will find a different use for it other
than testing.


[previous post]: /blog/2024/01/29/testing-neovim-plugins-with-busted/
[yo-dawg.nvim]: https://gitlab.com/HiPhish/yo-dawg.nvim
[GitHub mirror]: https://github.com/HiPhish/yo-dawg.nvim
[rainbow-delimiters.nvim]: https://gitlab.com/HiPhish/rainbow-delimiters.nvim
