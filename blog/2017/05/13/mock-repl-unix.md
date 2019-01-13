title: Creating a mock REPL on Unix
category: misc
---


During the development of [REPL.nvim] I had to be able to test the plugin
without relying on any particular REPL present on the development system. The
solution was to create a mock REPL, a shell script which acts like a really
dumb REPL. Here is the code:

~~~sh
EOF=false

echo 'This is a dummy REPL, it does nothing and comes with no warranty.'
until $EOF ; do
        printf '>>> '
        read -r || EOF='true'
        if [ ! "$REPLY" ]; then continue; fi
        echo "$REPLY"
done
# Terminating new line if there was no reply
if [ ! "$REPLY" ]; then echo ''; fi
~~~

The first line is a simple state variable which will be set to `true` once the
user presses `^D`. As long as the variable remains `false` the loop will keep
running.

Next comes the actual *Loop* part of the REPL; it prints a prompt and then
reads a line indefinitely. The *Read* part is implemented using the built-in
`read` to store the result in the implicit variable `$REPLY`. Should `read`
read `^D` the exist code will be non-zero, causing the conditional `||` to set
the `EOF` variable to `true`. This is our exit mechanism out of the REPL. There
is no *Evaluate* part since this is a mock REPL (or you could say that any
input evaluates to itself). Finally the *Print* part is implemented by using
`echo` to echo back the input.

Technically the REPL could also be implemented with less code:

~~~sh
EOF=false
until $EOF ; do
        printf '>>> '
        read -r || EOF='true'
        echo "$REPLY"
done
~~~

The additional code is just to give the REPL some extra polish. It's not really
needed if no human will never use it, but I like the extra touch. The first
line

~~~sh
if [ ! "$REPLY" ]; then continue; fi
~~~

prevents the loop from reaching the `echo` if `$REPLY` is an empty string.
Without it if the user does not enter any text an empty line would be printed:

~~~
# Without extra touch
>>> foo
foo
>>>

>>> bar
bar

# With textra touch
>>> foo
foo
>>>
>>> bar
bar
~~~

The other line

~~~sh
if [ ! "$REPLY" ]; then echo ''; fi
~~~

causes `echo` to display an empty string. This empty string will move the shell
prompt onto the next line:

~~~
# Without extra polish
sh-3.2$ sh mock-repl.sh
This is a dummy REPL, it does nothing and comes with no warranty.
>>> foo
foo
>>> sh-3.2$

# With extra polish
sh-3.2$ sh mock-repl.sh
This is a dummy REPL, it does nothing and comes with no warranty.
>>> foo
foo
>>> ^D
sh-3.2$
~~~

The mock REPL can then be invoked like any other shell script and be used in
place of a real REPL program when testing. That way we do not have to be wary
of any side effects and the developer does not need to have any particular
program installed on their system.

[REPL.nvim]: https://gitlab.com/HiPhish/repl.nvim/
