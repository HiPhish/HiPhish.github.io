---
title: A pipe operator for Lua
modified: 2021-03-07
category: open-source
tags: lua, elixir
---

I have recently been getting into [Elixir](https://elixir-lang.org/), and one
nice feature it has is the pipe operator. It allows us to express a pipeline
of function through which an object will be dragged. This got me thinking: with
how flexible Lua is, would it be possible to add something similar to Lua as
well?


## Piping in Elixir

Let's first consider how one would write code without piping. The [official
language
guide](https://elixir-lang.org/getting-started/enumerables-and-streams.html)
gives the following example:

```elixir
Enum.sum(Enum.filter(Enum.map(1..100_000, &(&1 * 3)), odd?))
```

This code takes a list of numbers, multiplies each one by three, removes all
that are not odd, and finally computes the sum. Here is the equivalent code in
Lua, assuming that we have a `range`, `map`, `filter`, `is_odd` and `sum`
function:

```lua
sum(filter(map(range(1, 100000), function(x) return x * 3 end), is_odd))
```

In order to understand this line you need to read the code inside-out. It's not
even a simple matter of reading from right to left since the right-most symbol
is the argument to `filter`.

Elixir has the pipe operator `|>` which allows us to write the expression as
follows:

```elixir
1..100_000 |> Enum.map(&(&1 * 3)) |> Enum.filter(odd?) |> Enum.sum
```

We can now clearly read the expression from left to right: the left-most symbol
is the original object, and every subsequent symbol is the next step of the
transformation pipeline. Here is what I want to be able to write in Lua:

```lua
pipe(1, 100000) {
    range
    function(xs) return map(xs, function(x) return x * 3 end) end,
    function(xs) return filter(xs, is_odd) end,
    sum
}
```

There are a couple of differences: since Lua can handle multiple values the
first function (`range`) can take two arguments, and since Lua does not perform
automatic currying we have to wrap `map` and `filter` each inside an anonymous
function. Also note that Lua lets us omit the parentheses around the table
literal.


## Piping in Lua

There will be a function called `pipe` which takes in any number of arguments
and returns a new function. This new function takes a pipeline (list of
functions to apply in consecutive order) and returns the result of the
pipeline.

```lua
function pipe(...)
    -- The arguments will get packed and unpacked repeatedly
    local args = table.pack(...)

    return function (pipeline)
        -- intermediate result, will be updated frequently
        local results = args

        for _, f in ipairs(pipeline) do
            -- unpacking and packing lets us deal with multiple values
            results = table.pack(f(table.unpack(results)))
        end

        -- a pipe can return multiple values
        return table.unpack(results)
    end
end
```

Let's try it out! The below pipeline will print a message as a side effect and
evaluate to `6`.


```lua
pipe(3) {
    -- Keep the number and generate a message
    function(x) return x, string.format('The number is %d') end
    -- Print the message, return the number (message gets dropped)
    function(x, msg) print(msg); return x end
    -- double the number
    function(x) return x * 2 end
}
```

As we can see, the number of values between steps in the pipeline can change.
The first function receives one argument but returns two values, and the second
function receives two arguments but returns one value. We can also store the
pipeline in a variable and use it multiple times:

```lua
local pipeline = {foo, bar, baz}  -- list items are some functions

-- Run 1, 2 and 3 all through the same pipeline one after the other
pipe(1)(pipeline)
pipe(2)(pipeline)
pipe(3)(pipeline)

-- Pipe a value inside a pipeline
pipe('hello') {
    function(s) #s end,                -- get length of string
    function(n) pipe(n)(pipeline) end  -- pipe the length through the pipeline
}
```


## Conclusion

This Lua implementation uses closures and works without additional syntax.
Unlike the Elixir implementation the pipeline is just a regular value and can
thus be stored in a variable and get passed around. The number of values is not
fixed and can even change between steps.

However, it has one big disadvantage: the Elixir pipeline lets your write
`Enum.filter(odd?)` and the compiler will treat it as a function which takes
the current value as the argument for us (`fn x -> Enum(x, odd?) end`). In Lua
this is not possible, we have to manually wrap the code inside an anonymous
function manually. We can store the functions in a variable and reference the
variable inside the pipeline, but that's just moving the problem one level up.

```lua
local function with_message(x) return x, string.format('The number is %d') end
local function push_message(x, msg) print(msg); return x end
local function double(x) return x * 2 end

pipe(3) {
    with_message,
    push_message,
    double
}
```

I will let the reader decide which is better. This simple piping implementation
lacks a mechanism for aborting the pipeline prematurely, that is something that
would need to be handled by the functions themselves. I should also point out
that these examples are very contrived, it would have been easier to just write
a loop instead. Piping pays off when we have large pipelines made up mostly of
functions which get used often.


## Update

In [another article](https://aead.io/2021/02/17/lua-function-pipelines/) it has
been pointed out that my implementation suffers from poor performance. That is
true, at every step of the pipeline I pack and unpack the arguments, which
creates a new table that will become garbage immediately afterwards. The author
works around the issue by gluing strings together to effectively rewrite the
pipeline into one nested function call. This does avoid the overhead of packing
and unpacking at the cost of an uglier implementation. I definitely recommend
reading the article.

I admit, I was not paying attention to performance. My focus was just on
exploring the idea of how to retrofit a new feature from another language for
the sake of novelty. In a real use-case I would have just written code as
follows:

```lua
local result = range(1, 100000) {
result = return map(result, function(x) return x * 3 end)
result = filter(result, is_odd)
result = sum(result)
```

Yes, it is not in the functional style, but it gets the job done out of the
box.


## Update 2

I fixed the URL to the other article.
