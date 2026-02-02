---
title: Debugging Lua scripts running in Neovim
category: vim
tags: vim, lua
---

In a [previous blog post] I wrote about testing Lua scripts in Neovim using the
[busted] test framework.  Today I want to look at how to debug Lua scripts in
Neovim using the [Debug Adapter Protocol] (DAP).  Just as before with busted,
our problem is that we need to use Neovim as our Lua interpreter because we
want to use Neovim's Lua API.  At the same time, the debug adapter expects the
Lua interpreter to conform to Lua's command-line interface.  That's right: we
need another command-line interface adapter.


## The debug adapter

There is a [wiki page] on how to configure [local-lua-debugger-vscode] as the
debugger.  I won't repeat the information here, instead let's take a simple
standard Lua script for a spin.

```lua
---Recursively add two non-negative integers.
local function add(x, y)
    if y == 0 then
        return x
    end
    return add(x + 1, y - 1)
end

local x, y = 2, 3
local sum = add(x, y)
print(sum)
```

Place a breakpoint somewhere and start debugging.  Does the debugger stop at
the breakpoint? Can you inspect values?  If yes, then good, otherwise get your
setup in order before you proceed.


## The command-line adapter

Let's recall the shim from the previous post.

```bash
#!/bin/sh

export XDG_CONFIG_HOME='test/xdg/config/'
export XDG_STATE_HOME='test/xdg/local/state/'
export XDG_DATA_HOME='test/xdg/local/share/'

# We have to explicitly enable plugins, see ':h -l'
nvim --cmd 'set loadplugins' -l $@
```

This was good enough for busted, but the debug adapter needs us to support the
command-line options.  Fortunately the only option we really need to implement
is `-e`.  We can use POSIX `getopts` (not to be confused with `getopt`) to
parse command-line options.

```bash
#!/bin/sh

export XDG_CONFIG_HOME='test/xdg/config/'
export XDG_STATE_HOME='test/xdg/local/state/'
export XDG_DATA_HOME='test/xdg/local/share/'

# Handle Lua command-line arguments; not all options are supported
while getopts 'ilEve:' opt; do
	case $opt in
		e) lua_expr=$OPTARG;;  # Store the option argument in a variable for later
		v) nvim --version; exit;;
		i | l | E) echo "Option '$opt' not supported by shim" >&2; exit 1;;
	esac
done

if [ -n "$lua_expr" ]; then
	nvim --headless -c "lua $lua_expr" -c 'quitall!'
else
	nvim --cmd 'set loadplugins' -l $@
fi
```

I also added support for the `-v` option because it is easy enough.  With `-e`
we can pass an expression to evaluate:

```bash
./nvim-shim -e 'print("Hello world!\n")'
```

With `-` as our script argument we can pass Lua code from standard input:

```bash
echo 'print("Hello world!\n")' | ./nvim-shim -
```

The two invocations of Neovim are so different from one another that I had to
use an `if` statement.


## A pure Lua adapter

Since my previous post I have been told about [nlua].  It is also a
command-line adapter made with the same goal as my shim, but written in pure
Lua and available on [LuaRocks].  You might like it better, but it is more
complicated than my shim and it is differently opinionated.  I will keep using
my shim because it handles isolation via XDG environment variables instead of
command-line flags, which is better suited for my testing needs.


## Debugging a Neovim script.

Let's try another Lua script, but this time we use the Neovim function
`vim.tbl_map`. Set your Lua interpreter to the shim in the configuration and
debug this script:

```lua
local animals = {
	cat = 'meow',
	cow = 'moo',
	dog = 'woof',
	frog = 'ribbit'
}

local function sound_length(sound)
	return #sound
end

local lengths = vim.tbl_map(sound_length, animals)

assert(4 == lengths.cat)
assert(3 == lengths.cow)
assert(4 == lengths.dog)
assert(6 == lengths.frog)
```

If everything went right the debugger should break at any breakpoint and you
should be able to inspect values.


## Next steps

Being able to debug some random Lua script is nice, but it is just one step
towards what what I'm really after: debugging tests.  The [Neotest] plugin lets
us run and debug tests; it does so by generating a debugger configuration on
the fly.

We will need a Neotest adapter for busted first though.  Currently there is an
adapter for the busted re-implementation in [Plenary], but not for the real
thing.  Let's see if I can get it written.



[previous blog post]: /blog/2024/01/29/testing-neovim-plugins-with-busted/
[busted]: https://lunarmodules.github.io/busted/
[Debug Adapter Protocol]: https://microsoft.github.io/debug-adapter-protocol/
[wiki page]: https://github.com/mfussenegger/nvim-dap/wiki/Debug-Adapter-installation#local-lua-debugger-vscode
[local-lua-debugger-vscode]: https://github.com/tomblind/local-lua-debugger-vscode
[nlua]: https://github.com/mfussenegger/nlua
[LuaRocks]: https://luarocks.org/
[Neotest]: https://github.com/nvim-neotest/neotest/
[Plenary]: https://github.com/nvim-lua/plenary.nvim
