---
title: Beware of 'require' at startup in Neovim plugins
category: vim
tags: neovim, lua
---

Recently I tagged version 0.9.1 of [rainbow-delimiters.nvim].  This update got
rid of one really nasty mistake I had been dragging along from the very
beginning until just recently: every time you started up Neovim a number of
`require` calls would run even if you never called `require` a single time
yourself.  In this post I would like to go over how this happened, why it is
bad and how I got rid of it.  Even though I am using rainbow-delimiters as an
example here, everything I am about to say applies to other plugins as well.


## What is an implicit `require`?

In Lua the `require` function searches for a Lua file whose path matches the
given pattern.  In other words, `require 'foo.bar.baz'` will find the file
`foo/bar/baz.lua`, load it as code and return the argument of the `return`
statement.  The rules Lua uses to search for a file based on the pattern are
slightly complicated, but the details are not relevant here.

I call these explicit `require` calls because you have to call the function
yourself. So what is an implicit `require` then?  There are certain files that
Neovim will source automatically on startup.  In particular these are any Vim
script and Lua files in the `plugin` directory.  If any of these contains a
call to require (or `:runtime` for Vim script) Neovim will search for the
corresponding file.


### An explicit but mandatory `require` is no different

There are also quasi-implicit `require` calls: if you add it yourself to a
script in the `plugin` directory it's effectively the same: a call to `require`
which is evaluated at startup.  For the sake of brevity I will consider them
the same as the aforementioned implicit calls from now on.


## The problem

When you call `require` Lua has to search a number of paths for the file.
Aside from the standard directories Neovim ships with and your personal
configuration directory, Neovim also has to add all your plugins as well to the
list.  The more plugins you have, the more expensive each call to `require`
gets.

This is not necessarily a problem in itself, `require` is so fast you will
never notice a single call.  Plus, results of `require` are cached, so you only
have to pay on the first call of each module.  However, these costs can add up
if you have to pay for all of it upfront at once.

Let's take a look at the startup time in version 0.8.0 with two custom
strategies set.

```lua
local rb = require 'rainbow-delimiters'

vim.g.rainbow_delimiters = {
	strategy = {
		[''] = rb.strategy['global'],
		commonlisp = rb.strategy['local'],
	},
}
```

```sh
$ nvim --startuptime time.log
```

Here are the relevant lines from the log:

```
150.465  000.225  000.225: require('rainbow-delimiters.config')
150.468  000.442  000.217: require('rainbow-delimiters.log')
150.655  000.185  000.185: require('rainbow-delimiters.util')
150.658  003.266  000.265: require('rainbow-delimiters.lib')
151.316  000.217  000.217: require('rainbow-delimiters.stack')
151.743  000.206  000.206: require('rainbow-delimiters.set')
151.746  000.428  000.221: require('rainbow-delimiters.match-tree')
151.748  000.894  000.249: require('rainbow-delimiters.strategy.global.current')
151.749  001.089  000.195: require('rainbow-delimiters.strategy.global')
152.210  000.275  000.275: require('rainbow-delimiters.strategy.local.current')
152.212  000.462  000.187: require('rainbow-delimiters.strategy.local')
152.408  000.195  000.195: require('rainbow-delimiters.strategy.no-op')
152.409  005.244  000.232: require('rainbow-delimiters')
209.073  000.262  000.262: require('rainbow-delimiters.default')
```

That is fourteen separate calls to `require`.  Some of this is because we call
`require` at the top in our configuration, but some of it is also just from
having rainbow-delimiters installed. From how I understand the log format the
second column is the time in milliseconds it took to complete this particular
call.  If we add them up we get a result of 13.39ms (the third column adds up
to 3.131ms).  That's practically nothing, but if we have a lot of plugins (I
have over 60 plugins myself) and each plugin is this badly behaved it does add
up.

### How could this happen?

To put it simply, I was not concerned about startup time at the time I wrote
this plugin.  There are two sources of implicit `require`:

- It is convenient to use Lua modules to organize code
- Strategies are Lua modules which evaluate to objects

With regards to the first point, I have multiple calls to `require` in a
`plugin` file, and the required modules have calls to `require` of their own,
and so on.  The top-level script is sourced at startup, and so the entire chain
is required at startup.  Using Lua modules is very convenient to tuck away
complexity and make it reusable, but even a single `require` can cascade out of
control.

With regards to the second point, I had this really clever idea of making
strategies Lua tables which you can swap out in your configuration.  This way
users could write their own strategies or compose strategies.  Encapsulating
functionality like this is known as the [strategy pattern].  And since Lua
modules can return an arbitrary value, why not make the entire module a
strategy and require it directly?


## The solution

The solution is simple: delay the `require` until we actually need it.  If
there are no rainbow parentheses to highlight, we do not need to `require`
anything. In my case I delayed `require` in two ways: using strings to refer to
Lua modules, and moving `require` into callback functions.

### Refer to Lua modules by strings

I wanted to retain the ability to specify a strategy as a Lua table.  So I
added a type discrimination to my code:

```lua
local strategy  -- Taken from the user's configuration
if type(strategy) == 'string' then
    strategy = require(strategy)
end
-- Proceed as before
```

Actually there is a bit more code for error handling if the module cannot be
found, but this is the basic idea.  Users can either set a table as the
strategy like before, or they can set a string which is the pattern to a Lua
module which evaluates to a table.

```lua
-- Look Ma, no require
vim.g.rainbow_delimiters = {
	strategy = {
		[''] = 'rainbow-delimiters.strategy.global',
		commonlisp = 'rainbow-delimiters.strategy.local',
	},
}
```

### Move `require` into callback functions

If the required module is only needed in callback functions, such as those
passed to autocommands, we can move the call into the callback.

```lua
local function my_callback(args)
    local lib = require 'rainbow-delimiters.lib'
    -- Do the other stuff...
end
```

This will make the callback *slightly* more expensive because `require` has to
look up the cached result, but that's negligible.  We are not trying to build a
game engine in Neovim.  If you really are concerned about the overhead you
could try something like this:

```lua
local lib  -- Initialised to nil

local function my_callback(args)
    if not lib then
        lib = require 'rainbow-delimiters.lib'
    end
    -- Do the other stuff...
end
```

I don't know if the overhead from the `if`-check is going to be more or less
expensive than repeatedly calling `require` and I honestly don't care at this
point. I'll let you be the judge.  Remember that the goal is not to not have to
call `require`, but to avoid calling it on startup for no reason.


## Closing thoughts

Was this worth it?  Will people see faster startup times now?  Probably not.
The issue is not any single plugin on its own, it is the sum of all the plugins
you have installed.  Fixing one single plugin won't make much of a difference,
but on the other hand this was such a simple fix and now I am no longer
contributing to the problem.  Hopefully other plugin authors will go ahead an
minimize their implicit `require` calls as well.  And yes, this does include
`setup` functions as well.

Someone might raise the point of “Why not use a plugin manager with
lazy-loading?”.  I would say it is not the responsibility of the user to use
band-aid solutions to fix problems with plugins.  We have had lazy loading
facilities like `ftplugin` or `autoload` in Vim before Neovim even existed, so
this is not a new problem and plugin authors back then were also expected to
make use of them.



[rainbow-delimiters.nvim]: https://gitlab.com/HiPhish/rainbow-delimiters.nvim
[strategy pattern]: https://en.wikipedia.org/wiki/Strategy_pattern
