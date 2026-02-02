---
title: Making Bash compliant with the XDG Base Directory specification
category: open-source
tags: unix
---

[GNU Bash] does not comply with the [XDG Base Directory] specification, it uses
the classical dotfiles approach where it just dumps all its files into the home
directory. It does not even have the courtesy of putting all its files in one
common `~/.bash` directory. Fortunately we can coerce Bash into compliance with
a bit of effort.


## Changing where Bash reads configuration from

There are two ways Bash can be invoked: as an interactive shell, and as a login
shell. We have to figure out which global files are sourced in both cases, and
adjust the code to source our custom files instead of the standard ones. The
files are as follows:

- For login shells `/etc/profile/`
- For interactive shells `/etc/bash/bashrc`

Reading the source of those files reveals some code similar to this snippet:

```sh
# Load profiles from /etc/profile.d
if [ -d /etc/profile.d/ ]; then
    for f in /etc/profile.d/*.sh; do
        [ -r "$f" ] && . "$f"
    done
    unset f
fi
```

What this means is that instead of changing the code of the global file and
potentially turning it into a mess, we can instead write a script which does
only one thing, place it in the designated directory and have it be sourced
automatically. The exact directory might differ from operating system to
operating system, so read your own global configuration file and the Bash
documentation.


### Login shells

Write the following code to the file `/etc/profile.d/bash_xdg.sh`:

```sh
# Make bash follow the XDG_CONFIG_HOME specification
_confdir=${XDG_CONFIG_HOME:-$HOME/.config}/bash
_datadir=${XDG_DATA_HOME:-$HOME/.local/share}/bash

# Source settings file
if [ -d "$_confdir" ] then
    for f in bash_profile bashrc; do
        [ -f "$_confdir/$f" ] && . "$_confdir/$f"
    done
fi

# Change the location of the history file by setting the environment variable
[ ! -d "$_datadir" ] && mkdir -p "$_datadir"
HISTFILE="$_datadir/history"

unset _confdir
unset _datadir
```


### Interactive shells

The code for interactive shells is similar. The file in question is
`/etc/bash/bashrc.d/bash_xdg.sh`

```sh
_confdir=${XDG_CONFIG_HOME:-$HOME/.config}/bash
_datadir=${XDG_DATA_HOME:-$HOME/.local/share}/bash

[[ -r "$_confdir/bashrc" ]] && . "$_confdir/bashrc"

[[ ! -d "$_datadir" ]] && mkdir -p "$_datadir"
HISTFILE=$_datadir/history

unset _confdir
unset _datadir
```


## Closing thoughts

I have prefixed every file sourcing with a test to make sure the files in
question actually exist. This will make sure that users who still use the old
dotfiles approach will not be hindered. But what if a user has both an XDG
directory file and a classic dotfile? I that case both will be sourced. This
may or may not be what you actually want though. I don't think there is a way
of preventing Bash from sourcing `~/.bashrc`, so you will have to live with
this quirk. You could print a warning message if both types of files are
detected and urge users to settle on one.

There is one more files used by Bash, but it is not exclusive to Bash:
`~/.inputrc` from [GNU Readline]. Readline is what powers the interactive input
and it can be used by other applications as well. Fortunately taking care of
Readline is simple: just set the `INPUTRC` environment variable somewhere
globally (e.g. in `~/.profile`) to the location of your XDG file.


[GNU Bash]: http://www.gnu.org/software/bash/
[XDG Base Directory]: https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
[GNU Readline]: https://tiswww.cwru.edu/php/chet/readline/rltop.html
