---
title: Testing Fennel in busted with Lua
category: vim
tags: lua, lisp, testing
---

[Fennel] is a Lisp-like language which compiles down to [Lua], so it should be
possible to test Fennel scripts in [busted].  Indeed, we can, but there are a
few points to note about testing Fennel code in Lua.


## The setup

Let's start with a very simple scenario: one source file with one function, and
one tests.

```
.
├── src
│   └── arithmetic.fnl
└── test
    └── arithmetic_spec.lua
```

The `arithmetic` module is straight-forward, it returns a table with one
function.

```fennel
;; src/arithmetic.lua
(fn add-two [x y]
  "Recursively add two numbers"
  (case y
    0 x
    _ (add-two (+ x 1) (- y 1))))

{: add-two}
```


## A simple test

You might already see the problem: the function has the name `add-two`, which
is not a legal identifier in Lua.  That's fine though, identifiers are nothing
but strings under the hood, we just have to reference the function in a
slightly awkward manner.  Here is the test code:

```lua
-- test/arithmetic_spec.lua
local arithmetic = require 'src.arithmetic'


it('Adds two numbers', function()
	assert.are.equal(5, arithmetic['add-two'](2, 3))
end)
```

Our Fennel script returns a table with one entry: the function with the key
`'add-two'`.  In Lua a key can be anything, we just have to explicitly index
it, hence `arithmetic['add-two']`.

This won't work though, we first need to teach busted how to find Fennel
modules.  The Fennel Lua API has the handy `install` function for that.  The
full test script is

```lua
-- test/arithmetic_spec.lua
local fennel = require 'fennel'
fennel.install()
debug.traceback = fennel.traceback

local arithmetic = require 'src.arithmetic'


it('Adds two numbers', function()
	assert.are.equal(5, arithmetic['add-two'](2, 3))
end)
```


## A helper script

Putting these three lines at the top of each script will get tedious and
error-prone quickly.  Fortunately busted has the notion of a *helper* script, a
script which will run first before any test files are read.  We can put all the
boilerplate code inside this script and the test scripts will be able to find
Fennel modules as if they were Lua modules.

```lua
-- test/helper.lua
local fennel = require 'fennel'
fennel.install()
debug.traceback = fennel.traceback
```

Now we can write the tests just as in our first draft.  To call the helper
script we have to explicitly pass it to busted, or add it to our `.busted`
file.

```sh
busted --helper test/helper.lua -- test/arithmetic_spec.lua
```


## Writing tests in Fennel?

Ideally we would also write our tests in Fennel, but we don't have that yet.
Busted can in theory support other languages as well (and it does support
[Moonscript]), but there is no loader for Fennel yet.  One day maybe.  Until
then Lua will have to do.



[Fennel]: https://fennel-lang.org/
[Lua]: https://www.lua.org/
[busted]: https://lunarmodules.github.io/busted/
[Moonscript]: https://moonscript.org/
