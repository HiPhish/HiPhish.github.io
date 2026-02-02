---
title: Neovim plugin settings with Lua metatables
category: vim
tags: neovim
---

A lot of new Neovim plugins come with a `setup` function which lets you specify
the settings of the plugin. Users are expected to call that function with a
table as arguments which contains the user's personal settings to override the
defaults. This works, but Lua is all about tables, so let's look at an
alternative.

This post will be rather large because I want to go lay out my thought process
step by step instead of just serving the final implementation as if I just came
up with it in one sitting.


## The idea

Most plugins require us to call a function named `setup` where we set our
personal settings. Anything not specified will fall back to the default of the
plugin. Here is what my configuration for Treesitter looks like:

```lua
local ts_config = require'nvim-treesitter.configs'

ts_config.setup {
	highlight = {
		enable = true,
		use_languagetree = true, -- use this to enable language injection
		custom_captures = {
		},
	},
	incremental_selection = {
		enable = true,
	},
	indent = {
		enable = true
	},
	context_commentstring = {
		enable = true,
	},
	playground = {
	}
}
```

Any key that is omitted will fall back to the default. This works fine, but it
has a few drawbacks:

- We cannot restore the default without restarting Neovim
- We do not have access to the stored options
- We do not have access to the defaults

My proposal is to expose a table to directly write the settings into.

```lua
local ts_config = require'nvim-treesitter.configs'

-- Set all options in one go
ts_config = {
	highlight = {
		enable = true,
		use_languagetree = true, -- use this to enable language injection
		custom_captures = {
		},
	},
	incremental_selection = {
	    enable = true,
    }
}

-- Set an option later
ts_config.indent = {
	enable = true
}

-- Restore a setting to the default by deleting it
ts_config.incremental_selection = nil

-- Query the default
default_commentstring = ts_config.context_commentstring
```

In order to make this safe we have to use two tables in the implementation: one
holds the defaults and is immutable, the other is public and can be written to
by the user. We will have to use Lua's metatables to wire up the two tables
together.


## Lua metatables

Metatables are an advanced Lua feature which lets us alter how objects behave
at runtime. Imagine that we want to add complex numbers to Lua; the only
compound data type we have in Lua is the table, so let's create a constructor
function which returns a table that represents a complex number.

```lua
local function complex(real, imaginary)
    return {
        real = real,
        imaginary = imaginary
    }
end
```

Simple enough. We also want to do arithmetic on complex numbers, so let's add
functions for that as well. Don't worry if you are not familiar with complex
numbers, I'm just trying to make a point here, the formula is not important.

```lua
local function complex_add(a, b)
    local real = a.real + b.real
    local imaginary = a.imaginary + b.imaginary
    return complex(real, imaginary)
end

local function complex_multiply(a, b)
    local real = a.real * b.real - a.imaginary * b.imaginary
    local imaginary = a.real * b.imaginary - a.imaginary * b.real
    return complex(real, imaginary)
end
```

This is all straight-forward, but it is really cumbersome to write code using
these functions. I would like to use the arithmetic operators `+` and `*` with
complex numbers just as I can use them with real numbers. This is where
metatables come into play: we can tell Lua “here is how you can add two complex
numbers” by specifying the function in a table. The metatable needs to be
attached to each complex number we create. Let's adjust the constructor.

```lua
local mt = {
    __add = complex_add,
    __mul = complex_multiply,
}

local function complex(real, imaginary)
    local result = {
        real = real,
        imaginary = imaginary
    }
    setmetatable(result, mt)  -- Metatable is shared between instances
    return result
end
```

Whenever Lua tries to add two objects it will look if one of them has a
metatable with an `__add` function and then call that function with the two
operands as arguments. The above function could be further improved to check
whether the arguments are indeed complex numbers or some other table, but that
is beyond the scope of this post.


## Metatables for safe defaults

We start out with two tables, one contains all defaults and is private, the
other is empty and public.

```lua
local M = {}  -- The module

-- Hard-coded defaults, never written to, never directly read from
local default = {
    cache_path = vim.fn.stdpath('cache') .. '/my_plugin',
    extra = {},
    size = {
        min = 0,
        max = 10
    }
}

-- Public configuration, read and write directory to this table
M.config = {}

return M
```

We can now set up a metatable for `config` which instructs Lua to look up an
entry in `default` if it does not exist in `config`.

```lua
local mt = {
    -- t is the original table, k is the key
    __index = function(t, k)
        return default[k]
    end
}

setmetatable(M.config, mt)
```

This will work fine for scalar entries like `cache_path`, but it will fail for
tables like `size`. Suppose the user has only assigned the `min` value. Now
when we read `config.size.max` Lua finds the custom `size` entry inside
`config`, but not the `max` entry within it, returning `nil` as the result. We
need to assign a separate metatable to the custom `size` so it knows where to
look for defaults. This is where the `__newindex` metamethod comes into play.

```lua
local mt = {
    __index = function(t, k)  -- unchanged
        return default[k]
    end

    -- t is the original table, k is the key, v is the value
    __newindex = function(t, k, v)
        t[k] = v
        -- If the value is a scalar we are done
        if type(v) ~= 'table' then return end
        -- Otherwise assign a new metatable to v
        local mt = {
            __index = function(t, k2)
                return default[k][k2]
            end,
        }
        setmetatable(v, mt)
    end
}
```

But wait, this will only work for one level of nesting. What if we have two or
more levels? We need a metatable constructor which returns a new metatable when
given a parent table. This will allow us to create arbitrary levels of nesting
in our configuration. Every time we look up a value we will recursively search
up the chain until we reach the root table.

```lua
local function make_mt(default)
    local result = {
        __index = function(t, k)
            return default[k]
        end,
        __newindex = function(t, k, v)
            t[k] = v
            if type(v) ~= 'table' then return end
            setmetatable(t, make_mt(default[k]))
        end
    }
    return result
end
```

This function will not run into infinite recursion. The inner call to `make_mt`
will not be executed until the `__newindex` function is called. However, now we
have broken the immutability of the default table. Consider the following case:

```lua
foo = require 'foo'

foo.config.size.max = 7
```

This is equivalent to `(config.size)['max'] = 7`. The table `config` is
empty, so indexing it via `config.size` returns a *reference* to the `size`
table from the default values. When we then index it via `size.max` we are
indexing and mutating the original table.

To solve this problem we can create a new empty table whenever we would index
the original. This new table gets assigned its own metatable. Then we try
indexing the `config` table again.

```lua
local function make_mt(default)
    local result = {
        __index = function(t, k)
            local original = default[k]
            -- scalars are returned by copy, so no extra steps needed
            if type(original) ~= 'table' then return original end
            -- tables are returned by reference, so we need a new table
            t[k] = {}
            -- the new table must index the original
            setmetatable(t[k], make_mt(original))
            return t[k]
        end,
        __newindex = function(t, k, v)
            t[k] = v
            if type(v) ~= 'table' then return end
            setmetatable(t, make_mt(default[k]))
        end
    }
    return result
end
```

It is important that we check whether the original is indeed a table. Scalar
values are considered terminal, they are returned by copy instead of reference,
so there is no danger in returning them. In fact, the terminal nature of
scalars is what prevents infinite recursion. This `__index` function works with
arbitrary levels of nesting.

If you were to try this code you would get a stack overflow error though. When
we assign the new table through the statement `t[k] = {}` are are assigning a
new entry to `t` which causes the `__newindex` function to be called. The same
also happens in `__newindex`. Our code is stuck in an infinite recursion until
we run out of stack frames. We need a way of adding an entry to a table without
going through these metamethods. This is what the function `rawset` is for.

```lua
local function make_mt(default)
    local result = {
        __index = function(t, k)
            local original = default[k]
            if type(original) ~= 'table' then return original end
            rawset(t, k, {})
            setmetatable(t[k], make_mt(original))
            return t[k]
        end,
        __newindex = function(t, k, v)
            rawset(t, k, v)
            if type(v) ~= 'table' then return end
            setmetatable(t, make_mt(default[k]))
        end
    }
    return result
end
```


## Putting it together

This has been quite a trip, but the final code is quite short.

```lua
local M = {}  -- The module

local default {
    cache_path = vim.fn.stdpath('cache') .. '/my_plugin',
    extra = {},
    size = {
        min = 0,
        max = 10
    }
}

local function make_mt(default)
    return {
        __index = function(t, k)
            local original = default[k]
            if type(original) ~= 'table' then return original end
            rawset(t, k, {})
            setmetatable(t[k], make_mt(original))
        end,
        __newindex = function(t, k, v)
            rawset(t, k, v)
            if type(v) ~= 'table' then return end
            setmetatable(v, make_mt(default[k]))
        end
    }
end

M.config = {}
setmetatable(M.config, make_mt(default))

return M
```

Once you understand the principle and the various pitfalls the code is really
not hard to understand. I intentionally made this post longer than it needs to
be because I wanted to walk the reader through every step and point out my
thought process.

Developing a solution is often an iterative process: we start out with a rough
idea of what we want, we get the basics right, test it, find edge cases, fix
those, test more, find new edge cases, and so on. It would have been easy to
just post the final solution, which can fit into the palm of one's hand, but it
would be nothing but a weird flex. Hopefully I have been able to convey my
train of though in a manner you were able to follow along.


## Can we do better?

Yes. The above code has one major flaw: it creates a new metatable for each
level of nesting. In a Neovim plugin this should not be much of an issue,
settings tables are rarely deep, but on the other hand the more plugins a user
has, the more settings tables there are going to be. Thus the number of
metatables is a functions of two parameters: the average depth of a settings
table, and the number of settings tables.

The better solution will have to wait for another time, this post has already
been in the making for too long. I will give you a little teaser though: it
involved three tables this time, our immutable settings table, a mutable
private table and an immutable public table. But wait, if the mutable table is
private and the public table is immutable, how can we do *anything* at all?
Well, that's where the one and only metatable will come into play. Stay tuned
and don't forget to subscribe to the RSS feed.


## Further reading

Metatables are explained in detail in the official Lua textbook. There is an
entire chapter dedicated to the topic. The reference manual covers the topic in
a more technical way.

- [Text book chapter](https://www.lua.org/pil/13.html)
- [Reference manual](https://www.lua.org/manual/5.1/manual.html#2.8)

The version of the book available for free online only covers Lua 5.0, but
Neovim uses version 5.1 of Lua. The reference manual I have linked is for Lua
5.1.
