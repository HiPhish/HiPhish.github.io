---
title: How I manage SSH connections
category: open-source
tags: unix
---

I have a number of machines I need to connect to via the secure shell (SSH),
and typing in the IP address or host name by hand every time get tedious very
quickly. I could use an application for that, but that's bloat. Let's instead
see how we can leverage small universal tools to build an elegant solution of
our own instead.

Since we have to use the terminal when using SSH anyway, we will create a
command-line tool using [FZF] which lets us type the partial name of a host and
make a selection. Here is what the end result will look like:

~~~
SSH >                                  ┌──────────────────────────────────────┐
  4/4                                  │ HostName     172.0.0.1               │
> Office                               │ User         johndoe                 │
  media-server                         │ Compression  yes                     │
  VM/dev-test                          │ ForwardX11   yes                     │
  VM/dev-master                        │                                      │
                                       │                                      │
                                       │                                      │
                                       │                                      │
                                       └──────────────────────────────────────┘
~~~

The goal is to create this interface and functionality using generic tools and
whatever we already have installed on the system.


## The big pattern

The first thing we have to do in order to tackle this large and new problem is
to break it down into small and familiar problems by finding the underlying
pattern. First we need a *source* of information and a *sink* into which the
information eventually flows. Between the source and the sink lies a *pipeline*
through which the data flows and gets changed along the way. In functional
programming this is the filter-map-reduce pattern: we take a (potentially
infinite) sequence of data, filter it down to just the information we need,
transform it into another shape, and finally we collapse the sequence into one
ultimate datum.


### The source

For our source we ideally want something we already have and which other
programs can use as well. Fortunately SSH offers us just that: a per-user
configuration file which you most likely are already using. The file is located
in `~/.ssh/config` and the syntax is explained in `ssh_config(5)`. Here is an
example of what an entry looks like:

~~~
Host Office
    HostName 172.0.0.1
    User johndoe
    Compression yes
    ForwardX11 yes
~~~

The first like starts with `Host` (or `Match`), followed by a host pattern. The
following lines until the next `Host` or `Match` are settings for the
aforementioned host. We have thus the following rules:

- Empty lines and lines starting with `#` are ignored
- Each line is a record, fields of a record are separated by whitespace,
	leading whitespace is ignored
- The first field is the setting (key), the second field is the value
- A `Host` or `Match` starts the settings for a new host

For now only the value of the `Host` is of interest to us, but we will come
back to the other rules later.

### The sink

The sink is simply the `ssh` command. However, we cannot feed the name of the
host into the standard input of `ssh`, we need to supply it as a command-line
parameter. The `xargs` command allows us to splice together the command line we
want:

~~~sh
# Same as calling `ssh Office`
echo 'Office' | xargs ssh
~~~


## The pipeline

Given our source and sink we need to perform the following steps:

- Filter out the host records from the config file
- Map each host record to just the name of the host
- Reduce the list of host names down to the one the user has selected

We can use `grep` to filter for the matching lines, `cut` to select the second
field, and finally `fzf` to present the user with the menu. Go ahead and try
out the commands in your shell manually to see how they work. The full command
line looks like this:

~~~sh
grep '^[[:space:]]*Host[[:space:]]' ~/.ssh/config | cut -d ' ' -f 2 | fzf | xargs ssh
~~~

There is a small flaw though: if the user cancels the FZF selection the
pipeline will keep going and `ssh` will be called without argument. We can fix
this by storing the output of `fzf` in a variable and checking the exit status
of the pipeline before calling `ssh`:

~~~sh
host=$(grep '^[[:space:]]*Host[[:space:]]' ~/.ssh/config | cut -d ' ' -f 2 | fzf)
[ $? -eq 0 ] && ssh "$host"
~~~

At this point we can call it a day, in two lines we have implemented a full SSH
connection selector which uses the user's own SSH configuration. Let's make the
presentation a bit easier on the eyes by specifying a few FZF settings. These
can be passed to the `fzf` command, but I find it more readable to have then in
an environment variable.

~~~sh
export FZF_DEFAULT_OPTS='
--height=20%
--reverse
--prompt="SSH > "'

host=$(grep '^[[:space:]]*Host[[:space:]]' ~/.ssh/config | cut -d ' ' -f 2 | fzf)
[ $? -eq 0 ] && ssh "$host"
~~~

You can set them to your liking of course. Here is what mine looks like:

~~~
SSH >
  4/4
> Office
  media-server
  VM/dev-test
  VM/dev-master
~~~

We can do better though: FZF will only display the host names, but if you have
many connections you might want to see the details of the currently selected
host in a little preview window.


## FZF preview

FZF has a `--preview` option which allows us to specify a command line whose
output will be displayed besides the selections. The command line can use the
value of the current selection to construct a custom command for each
selection. This means that given a host we have to pick out all its settings
from the SSH config file.

### A basic file processor

Recall the syntax of the config file from above. We have to loop over every
line in the file, match it against the rules, and take appropriate action. We
could write this file processor in any language, but in my opinion the best
choice is Awk with its declarative syntax.

Awk works by reading records from a file (by default a record is a line of
text), and for each line it matches it against a number of patterns and carries
out the action if the pattern matches. We get the main loop and pattern
matching for free, all we have to do is write the patterns actions. Here is our
first attempt:

~~~awk
# The HOST variable is passed from the command line

/^$/ || /^#/ {
    next
}

($1 == "Host" || $1 == "Match") && did_find_host {
    exit
}

$1 == "Host" && $2 ~ HOST {
    did_find_host = 1
    next
}

did_find_host {
    print $1, $2
}
~~~

These patterns reflect the config file syntax rules from above. Let's go over
them one by one.

- An empty line (`^$`) or a line starting with a number sign (`^#`) is ignored,
	we move on to the next line
- If we come across the definition of a host *after* we had already found our
	host we are done (the `did_find_host` variable is implicitly initialised to
	false in Awk)
- If we come across the definition of our host we mark it as found and move on
	to the next line
- If we come across a configuration after having found our host we print it

Now we need to add the preview command line to our FZF default options (the
`{}` stands for the current selection).

~~~awk
export FZF_DEFAULT_OPTS='
--height=20%
--reverse
--prompt="SSH > "
--preview="awk -v HOST={} -f ~/.ssh/bin/host2conf.awk ~/.ssh/config"'

host=$(grep '^[[:space:]]*Host[[:space:]]' ~/.ssh/config | cut -d ' ' -f 2 | fzf)
[ $? -eq 0 ] && ssh "$host"
~~~

The result looks just like the entry from the config file and we could stop now
if we wanted to.

~~~
SSH >                                  ┌──────────────────────────────────────┐
  4/4                                  │ HostName 172.0.0.1                   │
> Office                               │ User johndoe                         │
  media-server                         │ Compression yes                      │
  VM/dev-test                          │ ForwardX11 yes                       │
  VM/dev-master                        │                                      │
                                       │                                      │
                                       │                                      │
                                       │                                      │
                                       └──────────────────────────────────────┘
~~~

### A better file processor

The preview looks hideous, frankly speaking. The lines are all jagged and
everything is too crowded. How can we get the values to align neatly? We have
to pass through the entire file first, collect the entries, find out which key
is the widest, and use that to format the output in the end.

For this to work we need a new pattern `END` which will be run when we are
done, and we will need to change our printing pattern to collect results
instead.

~~~awk
BEGIN {  # Will match before processing the file
	n = 0  # Explicitly initialise as a number instead of empty string
}

did_find_host {
	keys[n] = $1
	values[n++] = $2
	width = max(length($1), width)  # Width of the widest key for padding
}

END {  # Will match after processing the file
	for (i = 0; i < n; ++i)
		printf "%-"width"s  %s\n", keys[i], values[i]
}
~~~

We use the variable `n` (set to `0` initially) to keep track of the number of
lines, and we use the arrays `keys` and `values` to keep track of the
individual keys and values. The reason for using two arrays is that Awk does
not support nested arrays. We also keep track of the width of the widest key
for alignment later.

The `END` pattern matches when the file has been read completely; we loop over
all settings and print them out. We can specify the padding in a format string
such as `%-10s`, where `10` is the width. Since in our case the width is
dynamically computed we have to splice the format string together through
string concatenation.

Putting all together we finally get our desired result:

~~~
SSH >                                  ┌──────────────────────────────────────┐
  4/4                                  │ HostName     172.0.0.1               │
> Office                               │ User         johndoe                 │
  media-server                         │ Compression  yes                     │
  VM/dev-test                          │ ForwardX11   yes                     │
  VM/dev-master                        │                                      │
                                       │                                      │
                                       │                                      │
                                       │                                      │
                                       └──────────────────────────────────────┘
~~~

Pure terminal beauty! We could now use ANSI control characters in our output to
also add colour, but I am not willing to go that far down the rabbit hole.


## Conclusion

Take the above shell script, put it in your `$PATH`, bind it to a key, write a
`.desktop` file for it, do whatever you want. We started out with a simple
shell script which did the minimum of what we need in just two lines of code,
then added little bits over time to make it more pleasant to use. Aside from
FZF all components come included with most Unix systems and use only what POSIX
specifies.

But why not just use an integrated application off the shelf instead? Why waste
time on building our own? An integrated application has one main advantage: it
just works, out of the box. On the other hands, rolling our own from generic
parts offers us with a number of advantages:

- Universal programs like FZF can be used for other purposes as well, an
	integrated application can do only one thing
- We can change it very easily by swapping out some of the generic components
- The knowledge we gain while writing this one tool can be of use later (e.g.
	knowing how to program Awk)
- Re-using the same application allows us to share settings (such as the SSH
	settings or FZF key bindings) instead of having to configure each integrated
	tool separately

The key to making this approach viable is that it has to be simple and cheap to
put together. Unix pipes, plain text configuration and the declarative syntax
of Awk allow us to focus on what is important instead of being weighted down by
technical details.

### But I don't want to use the terminal

If you prefer a GUI you can replace FZF with a graphical application like
[dmenu] or [rofi]. This is the beauty of the pipeline: you can swap out any
part of it without changing the rest of the logic. You could even write your
script to use one and fall back on the other if it ist not available.

With that said, you will end up in the terminal eventually anyway, so you might
as well start out in the terminal.

### Whitespace in values

I made a little lie by omission: it is possible for values to contain
whitespace characters if they are quoted. The above Awk script does not account
for this fact. The easy solution is to simply not use whitespace, which is what
I have decided to do.

Handling whitespace (or any general field separator) in Awk is not too hard,
but it is not trivial either. The [GNU Awk] implementation supports the `FPAT`
variable for this purpose. We could also use a more powerful programming
language such as Perl or one with an SSH config parsing library.

### The complete source code

The shell script `ssh-select.sh`:

~~~sh
#!/usr/bin/env sh

export FZF_DEFAULT_OPTS='
--height=20%
--reverse
--prompt="SSH > "
--preview="awk -v HOST={} -f ~/.ssh/bin/host2conf.awk ~/.ssh/config"'

host=$(grep '^[[:space:]]*Host[[:space:]]' ~/.ssh/config | cut -d ' ' -f 2 | fzf)
[ $? -eq 0 ] && ssh "$host"
~~~

The config file processor `host2conf.awk`
~~~awk
# Search the input (and SSH config file) for a given HOST and print all the
# host's settings in a tabular form to standard output. The HOST must be
# provided as a global variable to the Awk process.

BEGIN {
	n = 0  # Explicitly initialise as a number instead of empty string
}

# Skip comments
/^$/ || /^#/ {
	next
}

# A new host definition after we found our host terminates
($1 == "Host" || $1 == "Match") && did_find_host {
	exit
}

# Keep searching until we found our host
$1 == "Host" && $2 ~ HOST {
	did_find_host = 1
	next
}

# Accumulate all settings and their values for our host, ordered by their
# appearance in the input
did_find_host {
	keys[n] = $1
	values[n++] = $2
	width = max(length($1), width)  # Width of the widest key for padding
}

END {
	for (i = 0; i < n; ++i)
		printf "%-"width"s  %s\n", keys[i], values[i]
}

function max(a, b) {
	return a > b ? a : b
}
~~~



[FZF]: https://github.com/junegunn/fzf/
[dmenu]: https://tools.suckless.org/dmenu/
[rofi]: https://github.com/davatorium/rofi/
[GNU Awk]: https://www.gnu.org/software/gawk/
