---
title: Dotfiles were a mistake
tags: unix
---

Unix has a clever trick for hiding a file from being displayed by the `ls`
command or other file browsers: just prefix the file name with a period
character. Many applications use this fact in order to place hidden files or
directories in the user's home directory, usually containing settings, cached
files, persistent data and whatever else developers might come up with. This
practice has always struck me as just plain wrong, and I am glad that my
sentiment was confirmed by Rob Pike years ago.

The [original post] was on Google+, so here is an [archived link] instead. Here
is the post replicated, with formatting added by me:

> A lesson in shortcuts.
> 
> Long ago, as the design of the Unix file system was being worked out, the
> entries `.` and `..` appeared, to make navigation easier. I'm not sure but I
> believe `..` went in during the Version 2 rewrite, when the file system
> became hierarchical (it had a very different structure early on).  When one
> typed ls, however, these files appeared, so either Ken or Dennis added a
> simple test to the program. It was in assembler then, but the code in
> question was equivalent to something like this:
> ~~~
>    if (name[0] == '.') continue;
> ~~~
> This statement was a little shorter than what it should have been, which is
> ~~~
>    if (strcmp(name, ".") == 0 || strcmp(name, "..") == 0) continue;
> ~~~
> but hey, it was easy.
> 
> Two things resulted.
> 
> First, a bad precedent was set. A lot of other lazy programmers introduced
> bugs by making the same simplification. Actual files beginning with periods
> are often skipped when they should be counted.
> 
> Second, and much worse, the idea of a "hidden" or "dot" file was created. As
> a consequence, more lazy programmers started dropping files into everyone's
> home directory. I don't have all that much stuff installed on the machine I'm
> using to type this, but my home directory has about a hundred dot files and I
> don't even know what most of them are or whether they're still needed. Every
> file name evaluation that goes through my home directory is slowed down by
> this accumulated sludge.
> 
> I'm pretty sure the concept of a hidden file was an unintended consequence.
> It was certainly a mistake.
> 
> How many bugs and wasted CPU cycles and instances of human frustration (not
> to mention bad design) have resulted from that one small shortcut about  40
> years ago?
> 
> Keep that in mind next time you want to cut a corner in your code.
> 
> (For those who object that dot files serve a purpose, I don't dispute that
> but counter that it's the files that serve the purpose, not the convention
> for their names. They could just as easily be in `$HOME/cfg` or `$HOME/lib`,
> which is what we did in Plan 9, which had no dot files. Lessons can be
> learned.)

## Dotfiles are bad

There are two major issues with dotfiles:

- They clutter the user's home directory with junk most users don't even know
	where it comes from. Yes, I can guess that `.ssh` comes from SSH, but can you
	guess where `.tooling` is from?  Apparently [Gradle] though that was a really
	good name.

- They mix very different kinds of files all into one directory. I would like
	to version control my configuration files while at the same time being able
	to wipe cache files. Or maybe I have several sets of configurations which I
	want to switch out. When all the files are mushed into one directory it
	becomes hard at best, and impossible at worst to sort them out.

Dotfiles were never meant to be an actual thing. They are a bug which just got
silently promoted to a feature.

## A solution to dotfile madness

Rob Pike had the right idea about how to solve the dotfiles problem. The issue
is not that persistent files get created, the issue is that there is no rhyme
or reason to them. He had the right idea of splitting up the concerns into
separate directories, but his idea did not go far enough.

This is where the [XDG Base Directory] specification comes into play. The idea
is simple: designate a small number of (hidden) directories in the user's home
directory for different tasks. Each directory can be controlled through an
environment variable, and if the variable is not defined, a fixed default value
is used.

For example, configuration files for [Neovim](https://neovim.io/) are stored in
`$XDG_CONFIG_HOME/nvim`, where `$XDG_CONFIG_HOME` defaults to `~/.config`.
Persistent files, such as swap files are stored in `$XDG_DATA_HOME/nvim`, where
`$XDG_DATA_HOME` defaults to `~/.local/share`. Contrast this with Vim, where
all files are stored under `~/.vim`: 

- When I want to delete all persistent files in Vim I have to be extra careful
	not to also destroy my configuration. In Neovim I can just do `rm -rf
	~/.local/share/nvim` and be done with it.
- In order to version-control my configuration I have to meticulously add
	individual directories to the `.gitignore` file. In Neovim almost everything
	in `$XDG_CONFIG_HOME/nvim` can be version controlled. The only exceptions are
	leftovers from Vim, such as `doc/tags`.
- Swapping out a configuration in Vim is near impossible. You can specify which
	`vimrc` file to load, and use that file to adjust the runtime paths, or you
	can change the `$HOME` environment variable, but both ways are very hacky and
	fragile. Neovim gets this feature for free: just adjust any one of the
	environment variables you want to change.

You might be wondering why anyone would want all that, especially the last part
about swapping out configurations?  You could for example have one
configuration for your personal hobbies, and one for work. As remote work is
going to become more prevalent, having a set of “work config” and “at home
config” is going to be just as normal as having “work clothes” and “at home"
clothes.

The spec is very short and easy to read. Here are a few of the most important
directories to give you a taste:

- `XDG_CONFIG_HOME` (default `~/.config/`): configuration files, usually
	maintained and edited manually. You will want to version-control these.
- `XDG_DATA_HOME` (default `~/.local/share/`): data files, can be
	machine-generated. You will want to included these in your backups.
- `XDG_CACHE_HOME` (default `~/.cache/`): cache files. You usually don't want
	to back these up.
	
Aside from these `*_HOME` directories there is also a number of search
directories, but those are usually less interesting to end users.


## Some applications need to be dragged kicking and screaming into the future

Over time more and more applications will adopt the new specification, but
there will always be those that need to be nudged into the right direction. The
[ArchWiki page] has a very extensive list of applications which support the
new spec, which can be made to support and spec, and those which are a lost
cause.

The how-to depends on the particular application or library. We can for example
tell [GNU Readline] which file to use by setting an environment variable:

~~~sh
# Put this somewhere in your ~/.profile
INPUTRC="${XDG_CONFIG_HOME:-$HOME/.config}"/readline/inputrc
export INPUTRC
~~~

For other applications you might have to define a shell alias which passes an
extra parameters. Consult the manual page when in doubt.


## For the one weirdo who actually likes dotfiles

If for whatever reason you actually enjoy the mess that is dotfiles, just add
the following variable definitions:

~~~sh
XDG_DATA_HOME=$HOME
XDG_CONFIG_HOME=$HOME
XDG_CACHE_HOME=$HOME

export XDG_DATA_HOME
export XDG_CONFIG_HOME
export XDG_CACHE_HOME
~~~

Be aware though that these directories are meant to be *distinct*! If there is
a file `$XDG_DATA_HOME/foo/bar` and a file `$XDG_CONFIG_HOME/foo/bar`, then one
will overwrite the other.

Seriously, do yourself a favour and just move on. Dotfiles were never good in
the first place.


[original post]: http://plus.google.com/101960720994009339267/posts/R58WgWwN9jp
[archived link]: http://archive.is/vfXl2
[Gradle]: https://gradle.org/
[XDG Base Directory]: https://specifications.freedesktop.org/basedir-spec/latest/
[ArchWiki page]: https://wiki.archlinux.org/index.php/XDG_Base_Directory
[GNU Readline]: https://tiswww.case.edu/php/chet/readline/rltop.html
