---
title: Managing Vim plugins without a plugin manager
category: vim
tags: vim
---

Recently I have switched my Neovim setup to using the new native Vim package
system directly instead of relying on a plugin manager. I had to use Git
submodules for [another project] anyway, so I figured I could combine them with
Vim packages and see how that might work out. It is actually working pretty
well, to the point where I don't think that I will be returning to plugin
managers for the foreseeable future.

From here on when I say “Vim” I mean both Vim and Neovim.


## Vim's plugin system, or lack thereof

Vim does not actually have a plugin system. Instead there is the notion of a
runtime patch (`:h 'rtp'`) which is an option that contains a list of
directories. When Vim looks up a file name it searches these directories until
it finds the file in the appropriate subdirectory. For example, if you open a
file with file type `vim`, Vim will look for a file named `syntax/vim.vim` (or
`syntax/vim.lua` for Neovim) in each directory of the runtime path and source
each one it finds.

To manually load a file we can either use the `:runtime` command to find it in
one of the runtime path directories, or use the `:source` command with the
actual path to the file.


### Old-style manual plugin management

The simplest way of installing a Vim plugin is to download a script and place
it into the appropriate subdirectory inside `~/.vim` (or `~/.config/nvim` for
Neovim). This works fine as long as the plugin is just a single file. We can
update the plugin by swapping out the file and we can remove it by deleting the
file. However, once a plugin is made up of several files this approach becomes
impractical.

This is where the runtime path comes in. We can download the plugin to its own
dedicated directory and add it to the runtime path.

```vim
" Append a new directory path to the list
set runtimepath += /path/to/some/plugin
```

Now every plugin has its own directory and the files are not intermingled. To
update a plugin we swap out the directory for a newer version. To disable a
plugin we remove it from the runtime path. To uninstall a plugin we remove it
from the runtime path and delete the directory.


### Vim package managers

All Vim package managers essentially work by performing the above steps
automatically. They download repositories, pull in new commits, adjust the file
path and remove old repositories. The user only has to declare which plugins to
use. Usually they use Git for managing remote plugins, but you can also specify
a local directory.

I have used [Vundle], [vim-plug] and most recently [packer.nvim]. They all work
more or less the same: you specify your plugins in Vim script (or Lua), add a
bit of bootstrapping code at the beginning, and then from within Vim use custom
commands to install, update and remove plugins.

This all works fine, but I have found two annoyances:

- There is a chicken-and-egg problem where you need a plugin to manage plugins,
  so bootstrapping on a fresh install can take a number of manual steps
- I have my own plugins which I want to use and develop on at the same time, so
  they should not be version-controlled by the plugin manager

None of these are deal breakers. On the other hand, we *can* do better.


## Vim's native package system

Packages were introduces in Vim 8 and ported to Neovim. A Vim package (`:h
packages`) is a collection of plugins, and there can be an arbitrary number of
packages. The package directory is `~/vim/pack` for Vim, and
`stdpath('data')/site/pack` for Neovim (see `:h stdpath()`). The name of the
package is arbitrary and it contains two directories: `start` for plugins to
automatically load and `opt` for plugins to load on demand.

Here is an example of what a package might look like

```
~/.local/share/nvim/site/pack/3rd-party-plugins/
├── opt
│   └── foo
└── start
    ├── bar
    └── baz
```

The plugins `bar` and `baz` are always available. The plugin `foo` only becomes
available after executing `:packadd foo`. Behind the scenes Vim does the same
runtime path hackery that plugin managers do. However, Vim does not manage the
plugins, we have to download, update and remove them ourselves.


## Managing plugins through Git

There are three types of plugins I want to manage: 3rd party plugins, my own
plugins, and experimental plugins.


### 3rd party plugins

This is the most common type of plugin. Git has a submodule feature which lets
us embed repositories within repositories (see the man page
`gitsubmodules(7)`). A submodule is stored as an actual directory inside the
main repository and we can explicitly tell Git which path to use.  See `git
help submodules` for details.

First I create a regular Git repository `pack/3rd-party`. It contains the usual
files (`README`, `LICENSE` and so on). These belong to the repository. Then I
add the plugin as a submodule, either inside the `opt` or `start` directory.
Example:

```sh
# I want this plugin to always be active
git submodule add https://github.com/neovim/nvim-lspconfig.git start/nvim-lspconfig

# This is rarely used, so I will load it only when necessary
git submodule add https://github.com/Olical/conjure.git opt/conjure
```

I can use Git directly to update the plugins, choose a particular branch or
check out a particular commit. The file `.gitmodules` serves as the declarative
configuration file: I can re-arrange the order of submodules and add comments.
Here is what the above configuration would look like:

```
# Language Server Protocol configuration
[submodule "start/nvim-lspconfig"]
    path = start/nvim-lspconfig
    url = https://github.com/neovim/nvim-lspconfig
    ignore = untracked

# Live code evaluation while editing (Used mostly by the Lisp family)
[submodule "opt/conjure"]
    path = opt/conjure
    url = https://github.com/Olical/conjure
```

Note that we can add comments and move entries around, we are not limited to
the content Git has generated.

And the best part: since changes to a submodule are changes to the parent
repository I can commit each update. If an update breaks my configuration I can
easily roll back the parent repository to a previous commit. I get
transactional updates for free!

The only downside is that I have not been able to find a simple way of removing
submodules. This snippet of shell code works for me:

```sh
git rm "$MODULE" && git commit
rm -rf ".git/modules/$MODULE"
```

For frequently used actions, such as updating packages or removing them, I have
a directory of short shell scripts. Here are some examples:

```sh
# Add plugins from GitHub
while [ -n "$1" ]; do
	git submodule add "https://github.com/$1" "start/$(echo "$1" | cut -d/ -f2)"
	shift
done

# Remove all traces of the specified plugins
while [ -n "$1" ]; do
	git rm "$1" && git commit
	rm -rf ".git/modules/$1"
done

# Update all the specified plugins to the latest version
git submodule update --remote $*
```

Each example should be written to its own shell script because it uses the
command-line arguments as input.


### My own plugins

This one is simple. I create a new package (not a Git repository this time) and
add the repositories of my plugins to either `opt` or `start`. That's it. The
big difference compared to a plugin manager is that I do not have to declare a
list of plugins in advance, Vim will simply use what is there. If a particular
plugin is missing Vim won't know about it.


### Experimental plugins

These are plugins I just want to try out, experiment a bit and either throw
them away when done or move properly to my plugins collection. I have a
separate package for these where nothing is committed. Just clone, experiment
and move on when done.

A plugin manager always required me to add it to my configuration file and thus
alter my editor configuration during the experimentation phase.


## Conclusion

Vim packages are collections of plugins. By using what I already have and a
little bit of manual legwork I was able to meet all my requirements. I have
been using this system for about a month now and I have found the following
upsides:

- No additional manager plugin needed
- Can reuse already existing Git knowledge
- Different packages can serve different purposes (3rd-party plugins, personal
  plugins, experimental plugins)
- Git submodules allow tracking remote repositories and provide transactional
  version control
- Easier to bootstrap
- Can feel smug on the internet

On the other hand, these are the downsides:

- Requires good knowledge of Git and the shell
- Plugin configuration is separate from editor configuration and these two need
  to be kept synchronized

I will let the reader be the judged on how the weight these points against each
other. Personally though, I don't mind.


[another project]: /grid-framework/news/2021/09/11/git-packages-or-embedded-packages/
[Vundle]: https://github.com/VundleVim/Vundle.vim
[vim-plug]: https://github.com/junegunn/vim-plug
[packer.nvim]: https://github.com/wbthomason/packer.nvim
[XDG Base Directory specification]: https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
