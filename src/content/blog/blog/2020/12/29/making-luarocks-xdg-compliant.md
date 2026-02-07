---
title: Making LuaRocks (partially) compliant with the XDG Base Directory specification
category: open-source
tags: unix, lua
---

[LuaRocks] is a community-driven package manager for the [Lua] programming
language. LuaRocks packages can be installed globally or in the user's home
directory, but sadly LuaRocks does not follow the [XDG Base Directory]
specification. However, with a few lines of Lua code we can fix this
shortcoming partially at least.


## Package directory

LuaRocks's global configuration file depends on the particular version of Lua
it uses. For example, if you use Lua 5.3, then file path is
`/etc/luarocks/config-5.3.lua`. There we can adjust the `rocks_trees` table
entry which has its `name` set to `"user"`. There is one problem though: the
file is loaded from within a sandbox, which means that we do not have access to
the Lua standard library. Here is the adjusted table:

```lua
rocks_trees = {
   { name = "user", root = (os_getenv("XDG_DATA_HOME") or (home .. '/.local/share')) .. "/luarocks" };
   { name = "system", root = "/usr" };
}
```

The second entry is unchanged, the first entry is what we had to change. The
`root` entry contains the path to the directory we will be using to store
packages. Let me rewrite the expression a bit to be more readable:

```
   (os_getenv("XDG_DATA_HOME") or (home .. '/.local/share'))
   .. "/luarocks"
```

The first line gets either the value of the environment variable
`$XDG_DATA_HOME`, or uses `~/.local/share` as the default fallback, as defined
in the specification. Note that we have to use `os_getenv` instead of
`os.getenv` from the standard library because we are inside a sandbox. Please
refer to the [documentation] for more information about the sandbox.

Be aware that this changes the directory for all users on the system. There
does not seem to be a way to first check whether the directory `~/.luarocks`
exists from within the sandbox. This might trip up users who had already
installed packages before the change. It's simply something they will have to
live with.

## Configuration directory

I have to pass on this one. From what I have seen there is no way of changing
the location of the user configuration file. The system configuration file can
be changed during compilation, or at runtime through the `$LUAROCKS_CONFIG`
environment variable, but nothing similar exists for the user configuration
file.

[LuaRocks]: https://luarocks.org/
[Lua]: https://www.lua.org/
[XDG Base Directory]: https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
[documentation]: https://github.com/luarocks/luarocks/wiki/Config-file-format
