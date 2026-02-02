---
title: Running MongoDB from Guix
category: misc
tags: linux, guix
---

I have been watching a tutorial on [GraphQL] recently ([YouTube link]) where
the lecturer uses [MongoDB] for persistent storage. He instructs viewers to
sign up for a service that hosts a database, but I wanted to run a local
instance on my machine instead. MongoDB is not available in the [Void] repos,
but fortunately it is available in the [Guix] repos. However, running the Mongo
deamon requires a little tweak first.

First we install MongoDB the usual way: `guix install mongodb`, then can try
starting the daemon:

```
$ guix install mongodb
$ mongod
...
2021-02-28T18:12:26.460+0100 I STORAGE  [initandlisten] exception in initAndListen: 29 Data directory /data/db not f
ound., terminating
...
```

I have omitted all but the relevant message from the output. The issue is that
MongoDB wants to store its data in the `/data/db` directory, but due to the
fact that Guix does not mutate the operating system this directory will not be
created (Guix takes a functional programming approach to package management).
Even if it was, we would not have permission to write to it anyway.  MongoDB is
not meant to be run like a regular program, it is meant to be started as a
service, usually on a server we can connect to.

We can tell the daemon which directory to use instead by passing a command-line
option:

```
# You can use whatever directory you prefer instead
mongod --dbpath ~/.local/share/mongodb/data/db

# Even better: use a configuration file
echo "storage:
  dbPath: $HOME/.local/share/mongodb/data/db" > ~/.config/mongodb/config.yaml

mongod --config ~/.config/mongodb/config.yaml
```

Using a configuration file has the advantage that we can store many other
options in the same file as well as needed. Please consult the MongoDB
documentation for the exact for the format of the configuration file.

This is good enough to get a local MongoDB instance running for the current
user. Leave the shell with the daemon running and open a new shell, then try to
connect with the official client.

```
$ mongo
MongoDB shell version v3.4.10
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.4.10
>
```

Note the URL printed: `mongodb://127.0.0.1:27017`. This is the URL you have to
use when you want to connect to the database using another client.


[GraphQL]: https://graphql.org/
[YouTube link]: https://www.youtube.com/watch?v=ed8SzALpx1Q
[MongoDB]: https://www.mongodb.com/
[Void]: https://voidlinux.org/
[Guix]: http://guix.gnu.org/
