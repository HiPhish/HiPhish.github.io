---
title: A Guix daemon for runit
category: open-source
tags: guix, linux
---

I use [GNU Guix] as a secondary package manager on my system. Previously I have
been running [Kubuntu], which uses [systemd] as its init system, but I have
since switched to [Void], which uses [runit]. Guix comes with services for
systemd and [Upstart] included, but not for runit. Let's find out how to create
a runit service from scratch.

If you wish to follow along you need to know how to use the Unix command line
interface, log in as the `root` user, how to change the permissions of a file,
and how to control runit services.


## What is a Guix daemon anyway?

A Unix [daemon] is a background process. It is started and runs on its own
instead of being controlled directly by the users; it usually has some way for
other processes to deliver messages to it so it can perform some task. A daemon
is generally started by the init system, but it can also be started manually.

The Guix daemon is responsible for downloading and building packages. When you
want to install a package you do not have to use `sudo`, even though packages
are stored in some system-wide directory. Since a regular user lacks the
permissions to write to the Guix store (where all the packages are stored) this
is what happens roughly: The `guix` command sends a message to the daemon,
which then *on behalf of the user* downloads and builds the package. Without
the Guix daemon you would not be able to do anything system-wide.


## Starting the daemon by hand

The Guix manual details how to start the daemon manually.


> The `guix-daemon` program may then be run as `root` with the following
> command:
>
> ```sh
> # guix-daemon --build-users-group=guixbuild
> ```

We can try this. First log in as `root` in one shell and execute the above
command. The daemon process should be running. Now open a new shell and (as a
regular user) enter `guix build hello`. You should see the `hello` package
getting built. You can now terminated the daemon by pressing ctrl-c in its
shell.


## Writing a runit service

A runit service definition is a directory containing executable files with
certain names. The runit documentation covers the details, but for our purose
the only file file that matters is the `run` file. This file will be executed
when the service is started up, its purpose is to actually run the Guix daemon.
Create the following directory structure:

```
/etc
└── sv
    └── guix-daemon
        └── run
```

The directory `/etc/sv` is where services are defined. The name `guix-daemon`
is arbitrary, you could call your service whatever you want, but I chose the
same name used by systemd and Upstart for consistency.

The `run` file can be anything, as long as it is executable. A shell script is
the most logical choice, so that is what I chose.

```sh
#!/bin/sh
exec ~root/.config/guix/current/bin/guix-daemon --build-users-group=guixbuild
```

That is it. Note that you will have to adjust your file path if you installed
Guix in another location. We have to use `exec` so that the shell gets replaced
by the daemon instead of running the daemon inside the shell.

All that remains now is to test, enable and finally run the Guix daemon
service.



[GNU Guix]: http://guix.gnu.org/
[Kubuntu]: https://kubuntu.org/
[systemd]: https://systemd.io/
[Upstart]: http://upstart.ubuntu.com/
[Void]: https://voidlinux.org/
[runit]: http://smarden.org/runit/
[daemon]: https://en.wikipedia.org/wiki/Daemon_(computing)
