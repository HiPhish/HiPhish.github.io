---
title: Spreading tables in Lua
modified: 2021-01-02
category: open-source
tags: lua
---

Javascript has a spreading operator which lets us splice the contents of an
object or array into another object or array. This makes it very easy to create
an object based on another object and override or add entries. Since Lua and
Javascript are quite similar, wouldn't it be nice to have this operator in Lua
as well? Lua is a minimal language, so adding a new operator seems unlikely,
but Lua is also very flexible, and we can add a spreading function instead.

Before we go on, let's first see how spreading works in Javascript. Assume we
want to make a game which keeps track of players as objects. We want to have
a default player template and then create new players based on that template.

```javascript
// The template, never used as an actual player
const default_player = {
    name: '',
    score: 0,
    position: {
        x: 0,
        y: 0
    }
};

// An actual player, we override the name
const player1 = {
    ...default_player,
    name: 'Alice'
};
```

## A naive spread function

We will use Lua's support for closures and the ability to return a function.
Here is the implementation of the spread function:

```lua
local function spread(template)
    local result = {}
    for key, value in pairs(template) do
        result[key] = value
    end

    return function(table)
        for key, value in pairs(table) do
            result[key] = value
        end
        return result
    end
end
```

Let's take it apart. The function takes one argument, the original table we
want to spread apart. The return value is another function which also takes in
a table and returns a new table. The signature looks something like this:

```
spread: Table -> (Table -> Table)
```

That's a lot of tables, so what is going on here? Here are the steps performed
by the source code:

1) Create a new table called `result`. This will be the final result, but it is
   still empty at this point.
2) Copy all the values from the `template` table into it. Now the `result` is
   just a copy of the `template`.
3) Return a closure. The closure has a reference to the `result`, so we can
   still read and write to that table.
4) The closure takes in a new `table` and overwrites the entries of `result`
   with entries of `table`.
5) At this point the `result` is done and we can return it.

You might be wondering why I chose the convoluted approach of returning a
closure instead of simply taking two arguments. Indeed, that would have been
easier to write, but more awkward to use. This can be seen when we translate
the above Javascript example to Lua.

```lua
local default_player = {
    name = '',
    score = 0,
    position = {
        x = 0,
        y = 0,
    }
}

local player1 = spread(default_player) {
    name = 'Alice'
}
```

The first statement is almost the same as the Javascript version. In the second
statement I make use of the fact that in Lua if the only argument to a function
is a table literal we can omit the parentheses around the argument. This lets
us write the statement in a very elegant way. The expression `spread(...)`
almost looks like an operator, but since it's a function we can also assign it
to a variable.

```lua
-- A function which takes a table and returns a table
local player = spread(default_player)

local player2 = player {
    name = 'Bob'
}

local player3 = player {
    name = 'Carol',
    score = 3
}
```

This looks very declarative, and that is no coincidence. Lua's direct ancestor
Sol was a language for describing static data and Lua was created with the
intention to be used as a cross between a data description language and a
programming language (see the [history of Lua]). This declarative syntax is a
natural match. It is something we could safely expose inside a sandbox for
user's to declare their data.


## Further improvements

The naive implementation works for the most part and fully encapsulated the
core idea, but there a few details that should be fixed.

### Beware of shared closures

As the code now stands, if we want to re-use the closure we will have one
shared table. Consider the following example:

```lua
local player = spread(default_player)

local player1 = player {
    name = 'Alice',
    score = 5,
}

local player2 = player {
    name = 'Bob',
}
```

Bob will inherit the score of Alice because they both share the same
intermediate closure, and thus the same intermediate result. Even worse, Bob
will retroactively overwrite Alice's name as well. We can solve this by
spreading the template into a new table each time.

```lua
local function spread(template)
    return function(table)
        local result = {}
        for key, value in pairs(template) do
            result[key] = value
        end

        for key, value in pairs(table) do
            result[key] = value
        end
        return result
    end
end
```

Now the outer function is nothing more than just a wrapper.

### Deep copying of tables

Copying scalar entries is simple, but what if an entry has a table as its
value, such as the player's position? Since tables in Lua are passed by
reference changing one table will affect all other tables as well:

```lua
local player1 = player { name = 'Alice' }

-- This will mutate the shared position table
player1.position.x = 1

-- Now Bob and Carol also have their position.x set to 1
local player2 = player { name = 'Bob' }
local player3 = player { name = 'Carol', }
```

In that case we need to perform a deep copy on the value. This ensures that
each player has their own separate copy of the position. Here is the code:

```lua
local function deep_copy(object)
    if type(object) ~= 'table' then return object end

    local result = {}
    for key, value in pairs(object) do
        result[key] = deep_copy(value)
    end
    return result
end

local function spread(template)
    return function(table)
        local result = {}
        for key, value in pairs(template) do
            result[key] = deep_copy(value)  -- Note the deep copy!
        end

        for key, value in pairs(table) do
            result[key] = value
        end
        return result
    end
end

```

This takes care of tables in the template, but there is still the problem of
tables in the new value. If we assign a table to a value it will overwrite the
previous value. But what if the previous value was a table and we wanted only to
overwrite certain entries?

```lua
local player1 = player {
    name = 'Alice',
    -- Adjust the X position, but keep the Y position
    position = {
        x = 5
    }
}
```

Unfortunately there is no universal answer to this question. Do we really want
to merge the two tables, or do we want to overwrite the old table? I think it
this case it is more consistent and predictable to have the value be
overwritten (follow the principle of least astonishment). If users really want
to merge, they can use our `spread` function.

```lua
-- A new spreader function
local position = spread(default_player.position)

local player1 = player {
    name = 'Alice',
    position = position {
        x = 5
    }
}
```

### Metatables

The template table can have an associated metatable which we want new instances
to inherit.

```lua
local function spread(template)
    return function(table)
        local mt = getmetatable(template)
        local result = {}
        setmetatable(result, mt)

        for key, value in pairs(template) do
            result[key] = deep_copy(value)
        end

        for key, value in pairs(table) do
            result[key] = value
        end
        return result
    end
end
```

If the `template` has no metatable nothing will happen.

### Skip the intermediate closure

Returning a closure from `spread` is elegant if we are dealing with a table
literal, but it gets rather ugly if we have a table variable.

```lua
local player1_settings = { name = 'Alice' }
local player1 = spread(default_player)(player1_settings)

-- What I would rather want to write:
local player1 = spread(default_player, player1_settings)
```

It's not that ugly, but it would be more natural if we could simply pass the
second table as a second argument to the `spread` function instead. We can
reverse-curry the `spread` function by using the fact that missing arguments in
Lua get assigned `nil`.


```lua
local function spread(template, override)
    -- This is now a variable, not the return value
    local splice = function(override)
        local mt = getmetatable(template)
        local result = {}
        setmetatable(result, mt)

        for key, value in pairs(template) do
            result[key] = deep_copy(value)
        end

        for key, value in pairs(override) do
            result[key] = value
        end
        return result
    end

    -- Using the '_ and _ or _' pattern as a ternary operator
    return override and splice(override) or splice
end
```

If the `override` argument is not `nil` we immediately splice it into the
result. Otherwise we return the same function as before. We create a closure
each time, so here is a variant which only creates a closure when needed:

```lua
local function spread(template, override)
    if not override then
        return function(override)
            spread(template, override)
        end
    end

    local mt = getmetatable(template)
    local result = {}
    setmetatable(result, mt)

    for key, value in pairs(template) do
        result[key] = deep_copy(value)
    end

    -- No longer wrapped up inside a function
    for key, value in pairs(override) do
        result[key] = value
    end

    return result
end
```

This variant only creates a closure if the second argument is missing. This may
or may not be more efficient, I have not tried it. I leave it as an exercise to
the reader.


## Conclusion

Using Lua's powerful mechanisms (first-class functions and closures) and its
convenient syntax for table literals we have built a simple first spreading
function. With the basic idea in place we were then able to chip away at the
more obscure issues one at a time.

Note however, that a spreading function is not necessarily the best way of
implementing default values in Lua tables. The goal of this article has been to
implement a Lua analogue of the spread operator in Javascript. In practice
though you would more likely use a metatable that implements the `__index`
metamethod. It is generally better the use what the language already provides,
but if you need truly separate table instances, then spreading is a solution.


## Update

It has [been brought to my attention] that the original implementation would
keep mutating the shared `result` table if the closure gets re-used multiple
times. I have left this bug in the naive implementation, but added an
improvement to address the issue.


[history of Lua]: https://www.lua.org/history.html
[been brought to my attention]: https://www.reddit.com/r/lua/comments/kodkak/spreading_tables_in_lua/ghr29by/?utm_source=reddit&utm_medium=web2x&context=3
