---
title: Macho, the man command on steroids
category: open-source
tags: unix
---

The Unix `man` command can open a manual page if you know its name, and the
`apropos` command can search through the manuals if you are looking for a
specific word. Let's put the two to work together into a command I like to call
`macho`: the `man` command on steroids.

The idea is to feed the user's into into `apropos`, take its output, let the
user select one of the manuals, and feed the selection into `man`. As a bonus
we will look at how to use `macho` in a graphical environment as well to
display a nicely typeset PDF of the manual page.

Here are the dependencies:

- `man` and `apropos` (obviously)
- [FZF] for the command-line interface, and [dmenu] or [rofi] for the GUI
- Awk, `grep` and `sed` to plug in-between the above

And this is what the end result looks like:

~~~
Manual: ssh            ┌───────────────────────────────────────────────────────┐
  578/14561            │ SSHFS(1)           User Commands           SSHFS1/310 │
  (1)     ssh          │                                                       │
  (8)     sshd         │ NAME                                                  │
> (1)     sshfs        │        SSHFS - filesystem client based on ssh         │
  (1)     ssh-add      │                                                       │
  (1)     ssh-agent    │ SYNOPSIS                                              │
  (1)     ssh-argv0    │    mounting                                           │
  (1)     ssh-keygen   │        sshfs [user@]host:[dir] mountpoint [options]   │
  (1)     sshpk-conv   │                                                       │
  (1)     sshpk-sign   │    unmounting                                         │
  (5)     ssh_config   │         mountpoint                                    │
  (1)     ssh-askpass  │                                                       │
  (1)     ssh-copy-id  │ DESCRIPTION                                           │
  (1)     ssh-keyscan  │        SSHFS  (Secure  SHell  FileSystem) is a file   │
  (5)     sshd_config  │        system for Linux (and other  operating  sys‐   │
  (8)     ssh-keysign  └───────────────────────────────────────────────────────┘
~~~


## The `macho` command

### The basic pipeline

The *source* is the output of `apropos ${@:-.}`, which will list the manual
pages matching the queries passed to `macho`, or list all manual pages
installed on the system (fallback `.`) if nothing was provided. Our *sink* is
the `man` command with the user's selection (consisting of section and name) as
its first argument.

Here is the first attempt:

~~~sh
manual=$(apropos . | \
	grep -v -E '^.+ \(0\)' |\
	awk '{print $2 "	" $1}' | \
	sort | \
	fzf | \
	sed -E 's/^\((.+)\)/\1/')

[ -z "$manual" ] && exit 0
man $manual
~~~

Let's go over the code one step at a time. The first line prints all manuals
known to `man`.  The output format is as follows, where `s` is the section of
the manual:

~~~
name (s)    - a description for humans
~~~

For some reason `apropos` prints manuals with section `0`, which I want to
filter out using `grep`. Next we use Awk to format the output to be more
suitable for display by placing the section first before the manual name. This
makes the next step easier: sorting the manuals based on their section. Then we
pipe the output into FZF for the user to select one. Finally we format the
user's selection so that the section is without its parentheses, to be suitable
as arguments to the `man` command.


### Adding a preview to FZF

We can make the FZF interface more pleasant to use by specifying a few settings
in an environment variable.

~~~sh
export FZF_DEFAULT_OPTS='
--height=30%
--layout=reverse
--prompt="Manual: "'
~~~

However, the most useful option is a preview of the manual. When I use `macho`
I usually don't know what manual I am looking for, I only have a vague idea, so
being able to read the first couple of lines before I actually commit to my
choice is a big help. Here is the preview option with its pipeline:

~~~
--preview="echo {1} | sed -E \"s/^\((.+)\)/\1/\" | xargs -I{S} man -Pcat {S} {2} 2>/dev/null"'
~~~

The `{1}` placeholder is the first field of the selection, which in our case is
the section in parentheses. We need to strip those again using `sed` before
splicing together the `man` command with `xargs`. Note that we have to specify
a different placeholder for `xargs` (`{S}` here) because the default one is
already used by FZF.


### Selecting a section

It is wasteful to list all manuals from all sections if we already know what
section we are looking for. Let's add the `-s` option to `macho`. POSIX gives
us `getopt` to query command-line options, so let's use it.

~~~sh
while getopts ":s:" opt; do
	case $opt in
		s ) SECTION=$OPTARG;;
		\?) echo "Invalid option: -$OPTARG" >&2; exit 1;;
		: ) echo "Option -$OPTARG requires an argument" >&2; exit 1;;
	esac
done
~~~

We can now insert the contents of the `SECTION` variable into the `apropos
command`:

~~~sh
apropos -s ${SECTION:-''} .
~~~

Note how if the variable has not been set we substitute an empty string in
order to print all the manuals as before.


### Passing query strings

The primary purpose of `apropos` is to search the manuals for one or more
keywords, not to print all manuals to the output. Our `macho` command should be
able to do the same. To this end we need change our `getopts` to drop the
section option from the list of positional command-line arguments, and change
the `apropos` parameters to splice in all the remaining `macho` arguments.

~~~sh
# Note the two `shift`
while getopts ":s:" opt; do
	case $opt in
		s ) SECTION=$OPTARG; shift; shift;;
		\?) echo "Invalid option: -$OPTARG" >&2; exit 1;;
		: ) echo "Option -$OPTARG requires an argument" >&2; exit 1;;
	esac
done

# Note the `${@:-.}`, we still fall back to all manuals
apropos -s ${SECTION:-''} ${@:-.} 
~~~

And that's it, we have our `man` command on steroids.


## Bonus: a `macho` GUI

The `man` command can export manuals in formats other than plain text, such as
a nicely typeset PDF. The pipeline is almost the same, so I'll just give you
the complete code.

~~~sh
manual=$(apropos -s ${SECTION:-''} ${@:-.} | \
	grep -v -E '^.+ \(0\)' |\
	awk '{print $2 "	" $1}' | \
	sort | \
	rofi -dmenu -i -p "Manual: " | \
	sed -E 's/^\((.+)\)/\1/')

[ -z "$MANUAL" ] && exit 0;

man -T${FORMAT:-pdf} $manual | ${READER:-zathura -}
~~~

The only real difference in the pipeline is that we use `rofi` as our selector
(or dmenu if you prefer). The last line uses the `-T` option to specify the
output format and pipes it into the reader. You will need a PDF reader which
can read from standard input. I use [Zathura], which needs `-` as its input
file argument in order to read from standard input, but any other PDF reader
will work as well.


## Conclusion

In my [previous blog post](/blog/2020/05/23/how-i-manage-ssh-connections/) we
have seen how many small and universal tools can be glued together in order to
build more specialised tools on top of them. In this post we have built upon
this knowledge and seen how we can re-use those same generic tool for a
different purpose.

It should be noted that since we used FZF (or Rofi or dmenu) in both instances,
settings which we have defined for them will always apply. In practice this
means that I can for example use the same set of custom key bindings both when
selecting SSH connections, and when browsing my manual pages. Or if we
specified settings for `man`, such as a custom pager, they will be inherited by
`macho` as well.


### The full source code

~~~sh
#!/bin/sh

export FZF_DEFAULT_OPTS='
--height=30%
--layout=reverse
--prompt="Manual: "
--preview="echo {1} | sed -E \"s/^\((.+)\)/\1/\" | xargs -I{S} man -Pcat {S} {2} 2>/dev/null"'

while getopts ":s:" opt; do
	case $opt in
		s ) SECTION=$OPTARG; shift; shift;;
		\?) echo "Invalid option: -$OPTARG" >&2; exit 1;;
		: ) echo "Option -$OPTARG requires an argument" >&2; exit 1;;
	esac
done

manual=$(apropos -s ${SECTION:-''} ${@:-.} | \
	grep -v -E '^.+ \(0\)' |\
	awk '{print $2 "	" $1}' | \
	sort | \
	fzf  | \
	sed -E 's/^\((.+)\)/\1/')

[ -z "$manual" ] && exit 0
man $manual
~~~

Here are a few ideas for further improvement:

- How a help message when the user passes `-h` or `--help` as arguments
- Stop processing options when encountering `--`
- Display the user's query string somewhere, for example as part of the FZF
	prompt
- Pass some options from `macho` to `man`, like the output format
- Play around with the FZF preview command, perhaps it can be made faster


[FZF]: https://github.com/junegunn/fzf/
[dmenu]: https://tools.suckless.org/dmenu/
[rofi]: https://github.com/davatorium/rofi/
[Zathura]: https://pwmt.org/projects/zathura/
