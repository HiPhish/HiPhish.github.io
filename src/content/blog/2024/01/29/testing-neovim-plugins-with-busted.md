---
title: Testing Neovim plugins with Busted
category: vim
tags: neovim, lua
modified: 2024-02-20
---

The most annoying part about writing plugins for Neovim has been the lack of a
good test framework.  There are a couple of frameworks, and [Vader] has been my
favourite so far, but they all have their downsides.  This made me wonder: why
limit myself to Vim/Neovim test frameworks?  We have a full Lua runtime, and
other people already have solved the testing problem for Lua.  [Busted] does
90% of what we need, so let's fill in the remaining 10%.  The following is
based on my experience with adding tests to [rainbow-delimiters.nvim].


**Update (2024-02-01):** The [nlua] project has been brought to my attention,
it acts like a more complete version of the command-line interface adapter
described below. It does not handle environment isolation though, so you will
still need to set environment variables.

**Update (2024-02-20):** I have since changed how I handle the symlink.
Checking it into the repo is a problem for users who run the Lua language
server and telling everyone to add `test/xdg` to their servers ignore list is
unacceptable. Instead I decided to create and delete the symlink each time
inside the shim.


## Requirements

The following requirements must be met:

- Tests must be run inside Neovim
- Each test must run inside its own Neovim process
- The user's own configuration and plugins must not be interfere with the test
- CI friendly: tests results are printed to the standard output and the exit
  code indicates success or failure

Testing Neovim plugins is tricky because of Lua's nature as an embedded
language.  Normally we don't write standalone Lua scripts (although we could if
we want to), instead we run our scripts from inside another application which
embeds a Lua interpreter.  This is very similar to how Javascript can be
embedded both inside a web browser and inside an interpreter like Node.js. This
similarity will be relevant later when we discuss functional tests.


## Preparation

### Neovim as a Lua interpreter

Our tests will be using Neovim's Lua API, so we need to find a way to run the
test code inside Neovim.  Version 0.9 added the `-l` command-line flag which
does exactly that: Neovim will run as a Lua interpreter and any arguments past
`-l` are treated as arguments to the interpreter.  The first argument is the
script, subsequent arguments are command-line arguments to the script.

We will write a small command-line adapter which exposes the same command-line
interface as the standalone Lua interpreter.  These types of thin adapters are
called “shims”.  Let's create a file named `test/nvim-shim`.

```sh
#!/bin/sh

nvim -l $@
```

The `$@` causes any arguments to the shim to be spliced into the line.  This
shim is all we need to run scripts, but we will have to revisit it a couple
more times to address our other requirements.

### Isolation from the user's own configuration

I do not want my own configuration and plugins to interfere with testing.
There might be some setting which could obscure a bug, or different people's
setting could produce different test results.  Fortunately Neovim follows the
[XDG Base Directory] specification, so all we have to do is set the
corresponding environment variables in our shim.

```sh
#!/bin/sh

export XDG_CONFIG_HOME='test/xdg/config/'
export XDG_STATE_HOME='test/xdg/local/state/'
export XDG_DATA_HOME='test/xdg/local/share/'

nvim -l $@
```

With this our configuration will be entirely contained inside the `test/xdg`
directory.  The path does not matter, you can use some other value instead.

### Dependencies

At the very minimum there will be one dependency: the plugin itself.
Furthermore, if our plugin depends on some other plugin we have to include it
as well.  Since all tests are running in an isolated environment we cannot rely
on our standard paths, we have to use `test/xdg` instead.

Let's create a directory `test/xdg/local/share/nvim/site/pack/testing/start`
(`testing` is an arbitrary name) and place all dependencies there.  This path
will be searched for plugins automatically, there is no need for a package
manager.

#### Referencing the plugin itself

We can create a symlink to the plugin itself.  The name of the symlink is
arbitrary.

```sh
cd test/xdg/local/share/nvim/site/pack/testing/start/
ln -l ../../../../../../../../../ rainbow-delimiters
```

As an aside, if you are using the [Lua Language Server] you should set it up to
ignore the symlink directory, or else the language server will run in circles
when analysing the project.  Personally I just ignore all of `test/xdg`.

##### Update: forget everything I just said

We can instead create the symlink inside the shim and delete it at the end.
Then users don't have to mess around with their language server settings.

```sh
#!/bin/sh

export XDG_CONFIG_HOME='test/xdg/config/'
export XDG_STATE_HOME='test/xdg/local/state/'
export XDG_DATA_HOME='test/xdg/local/share/'

ln -s $(pwd) ${XDG_DATA_HOME}/nvim/site/pack/testing/start/rainbow-delimiters
nvim -l $@
exit_code=$?
rm ${XDG_DATA_HOME}/nvim/site/pack/testing/start/rainbow-delimiters

exit $exit_code
```

Note that we store the exit code of `nvim` because we want the exit code of the
entire shim to be the exit code of Neovim.  We also want to remove the symlink
regardless of whether the tests were successful or not.

#### 3rd party dependencies

Other plugins can be added as Git submodules.  Let's say that our plugin
depends on [nvim-treesitter].

```sh
url=https://github.com/nvim-treesitter/nvim-treesitter
path=test/xdg/local/share/nvim/site/pack/testing/start/nvim-treesitter

git submodule add ${url} ${path}
```

Git submodules have the added advantage that we can nail down the specific
version we are testing against.

#### Local configuration

We might need custom configuration in our isolated test environment.  Maybe we
want to configure a 3rd-party plugin, or maybe we want to add additional
functions and commands which do not belong into the plugin.  Custom
configuration can be added to `test/xdg/config/nvim`.  In my case I have this
helper function:

```lua
-- File plugin/ts-ensure.lua

local parser_pattern = 'parser/%s.*'

---Wrapper around the `:TSinstallSync` command which will only install a parser
---if it is not installed yet
function TSEnsure(lang, ...)
    for _, l in ipairs({lang, ...}) do
        local parsers = vim.api.nvim_get_runtime_file(parser_pattern:format(l), true)
        if #parsers == 0 then
            vim.cmd {cmd = 'TSInstallSync', args = {l}}
        end
    end
end
```

I can then call this function in my functional tests (more on those later) to
make sure the corresponding parser is installed within the isolated test
environment.


### Loading plugins into the shim

Unfortunately merely making plugins visible is not enough when using the `-l`
flag.  The manual entry for `:h -l` says:

> Disables plugins unless 'loadplugins' was set.

Let's update the shim one more time

```sh
#!/bin/sh

export XDG_CONFIG_HOME='test/xdg/config/'
export XDG_STATE_HOME='test/xdg/local/state/'
export XDG_DATA_HOME='test/xdg/local/share/'

ln -s $(pwd) ${XDG_DATA_HOME}/nvim/site/pack/testing/start/rainbow-delimiters
nvim --cmd 'set loadplugins' -l $@
exit_code=$?
rm ${XDG_DATA_HOME}/nvim/site/pack/testing/start/rainbow-delimiters

exit $exit_code
```

It is important to use `--cmd` instead of `-c` because the command needs to be
executed before configuration is read.  This is the final shim, we can now
instruct Busted to use the shim as the interpreter.  Make sure the shim is
executable.


### Configure Busted

As per the Busted help text we can pass the path to a Lua interpreter to the
`--lua` command-line option, and the manual says that we can use a Lua file
called `.busted` to specify options.  Let's create this file at the root of the
plugin.

```lua
return {
    _all = {
        lua = './test/nvim-shim'
    },
}
```

With this our preparations are done and we can start writing tests.


## Writing tests

For our purpose there are two types of tests: unit tests and functional tests.

### Unit tests

A unit test tests a small unit of code (like a Lua module) in isolation.  It
does not depend on or affect global state.  In a text editor there won't be
many such units because the entire point of the plugin is to modify the state
of the text editor.  Nevertheless, there usually will be some module that can
be tested in isolation.  In Rainbow Delimiters there is an implementation of a
stack data structure, so let's test that.

All my unit tests live in `test/unit` and by convention tests end in
`_spec.lua`.  In Busted it is common to place tests next to the source code,
but I prefer to keep them out of Neovim's search directories (see `:h 'rtp'`).
First we need to update the `.busted` file; Busted has the notion of “tasks”,
which are groups of tests, so let's create a new task called `unit`.

```lua
return {
    _all = {
        lua = './test/nvim-shim'
    },
    unit = {
        ROOT = {'./test/unit/'},
    },
}
```

Now we can write our first test.  Create a new file named
`test/unit/stack_spec.lua` with the following content:

```lua
local Stack = require 'rainbow-delimiters.stack'

describe('The stack data structure', function()
    describe('The empty stack', function()
        local stack

        before_each(function() stack = Stack.new() end)

        it('Can instantiate an empty stack', function()
            assert.is_not._nil(stack)
        end)

        it('Is empty', function()
            assert.is.equal(0, stack:size())
        end)

        it('Can push items onto the stack', function ()
            stack:push('a')
            stack:push('b')
            assert.is.equal(2, stack:size())
        end)
    end)
end)
```

I won't go into details on how to write tests in Busted, you can read the
manual for that.  The interesting part is that this test will run inside
Neovim, we have access to the entire Neovim library and all plugins which exist
in our isolated environment.

To run the test we call Busted as usual and instruct it to run the `unit` task.
I have installed Busted via [LuaRocks], so I run the following from the shell:

```sh
eval $(luarocks path --lua-version 5.1 --bin) && busted --run unit
```

For convenience I use a makefile, but you can also run the command from the
shell manually.  Note that I set the Lua version to 5.1 because that is the Lua
version Neovim uses.

### Functional tests

Here is where it gets interesting.  A functional test tests the behaviour of
the entire plugin, how it reacts to the editor state and how it affects it.
Unlike unit tests, this does involve mutation of the global state, so it is
important that each tests runs in its own process.  But all our tests run
inside the same Busted process, so what do we do?  Have a separate Busted
task for each individual test?

Let's take a step back.  Lua is not unique, there are other embedded languages,
so someone probably already has solved the problem and we can copy the
solution.  Javascript is also an embedded languages and it powers massive
applications (for better or worse), and these applications need testing as
well.

Javascript web applications can be tested using a framework like [Selenium].
Selenium lets us control a web browser through scripting and lets us probe the
state of the page.  That's it, that is all Selenium does, it is up to use to
decide what to do with this power.  A test can be written in Javascript using a
framework like [Jest], but it does not have to.  What matters is that the test
can now control the browser, which runs the actual web application, and that
the test can probe the browser to figure out whether the right thing has
happened.

Fortunately we do not need a massive framework like Selenium, Neovim already
provides everything we need out of the box:

- Start a new embedded Neovim process
- Control it through the Neovim API (`:h API`) over RPC

Let's write a simple functional test.

```lua
local jobopts = {rpc = true, width = 80, height = 24}

describe('Math in Vim script', function()
    local nvim  -- Channel of the embedded Neovim process

    before_each(function()
        -- Start a new Neovim process
        nvim = vim.fn.jobstart({'nvim', '--embed', '--headless'}, jobopts)
    end)

    after_each(function()
        -- Terminate the Neovim process
        vim.fn.jobstop(nvim)
    end)

    it('Can add up two numbers', function()
        local result = rpcrequest(nvim, 'nvim_eval', '2 + 3')
        assert.is.equal(5, result)
    end)

    it('Sets a buffer file type', function()
        rpcrequest(nvim, 'nvim_buf_set_option', 0, 'filetype', 'lua')
        local result = rpcrequest(nvim, 'nvim_eval', '&filetype')
        assert.is.equal('lua', result)
    end)

    it('Creates new buffers with empty file type', function()
        local result = rpcrequest(nvim, 'nvim_eval', '&filetype')
        assert.is.equal('', result)
    end)
end)
```

There are a couple of things to note here:

- We start Neovim with `--embed` and `--headless`; this makes Neovim run
  without a TUI and with its standard IO expecting RPC messages
- We use `rpcsend` to communicate with the embedded Neovim process remotely
- The third test is unaffected by the file type setting of the previous test
- We need to declare the variable `neovim` outside of our tests due to Lua's
  scoping rules, but the value of the variable is assigned anew for each test
- We cannot confirm the state of the embedded Neovim directly, we first have to
  query it for a value and then compare the given result to the expected value

To run functional tests we define a new Busted task:

```lua
return {
    _all = {
        lua = './test/nvim-shim'
    },
    unit = {
        ROOT = {'./test/unit/'},
    },
    functional = {
        ROOT = {'./test/e2e/'},
        pattern = '',  -- No fancy names for E2E tests
    },
}
```

While I was at it I also removed file any pattern restrictions.  Functional
test are run the same way as unit tests.

```sh
eval $(luarocks path --lua-version 5.1 --bin) && busted --run functional
```

As far as Busted is concerned there is nothing special about these tests.  We
are calling regular Lua functions; that these functions start a new process is
irrelevant.  In fact, we could have written functional tests in any language we
want, it just made the most sense to use Lua where we get all the low-level
technical details of the RPC protocol implemented for free from Neovim.


## Conclusion

Instead of writing a new test framework we were able to leverage what we
already have and only write a relatively small amount of glue code to fill in
the gaps between the individual pieces.  This was only possible because Neovim
gives us all the tools we need:

- The `-l` flag to use it as a Lua interpreter
- The ability to embed a headless instance
- The RPC API
- Following the XDG Base Directory specification

The key insight is that the Neovim instance running the test does not have to
be the same Neovim instance which is being tested.  Instead we control a new
Neovim instance, similar to what the Selenium framework does with web browsers.


### Bonus: an RPC plugin?

Writing `rpcrequest(nvim, 'nvim_...', ...)` for every single request gets
tedious and noisy very quickly.  I know I said we do not need a massive
framework like Selenium, but it would be nice to have some sort of RPC plugin
which cuts down on the boilerplate.  Something like this:

```lua
local wrapper = require 'my-hypothetical-plugin'

describe('Math in Vim script', function()
    local nvim  -- Channel of the embedded Neovim process

    before_each(function()
        nvim = wrapper.new()
    end)

    after_each(function()
        wrapper.stop(nvim)
    end)

    it('Can add up two numbers', function()
        local result = nvim:eval('2 + 3')
        assert.is.equal(5, result)
    end)

    it('Sets a buffer file type', function()
        nvim:buf_set_option(0, 'filetype', 'lua')
        local result = nvim:eval('&filetype')
        assert.is.equal('lua', result)
    end)

    it('Creates new buffers with empty file type', function()
        local result = nvim:eval('&filetype')
        assert.is.equal('', result)
    end)
end)
```

I am not promising anything here, this is just me throwing out an idea.

### Bonus: a little trivia

Selenium is the name of a [chemical element], it is derived from the Greek word
σελήνη (selene), which means “moon”, which is “lua” in Portuguese.  Is this a
cute little coincidence, or could there be some deeper meaning behind it?


[Vader]: https://github.com/junegunn/vader.vim
[Busted]: https://lunarmodules.github.io/busted/
[rainbow-delimiters.nvim]: https://gitlab.com/HiPhish/rainbow-delimiters.nvim
[XDG Base Directory]: https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
[Lua Language Server]: https://luals.github.io/
[nvim-treesitter]: https://github.com/nvim-treesitter/nvim-treesitter
[LuaRocks]: https://luarocks.org/
[Selenium]: https://www.selenium.dev/
[Jest]: https://jestjs.io/
[chemical element]: https://en.wikipedia.org/wiki/Selenium
[nlua]: https://github.com/mfussenegger/nlua
