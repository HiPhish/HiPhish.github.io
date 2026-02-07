---
title: Neovim channel for GNU Guix
category: vim
tags: lisp, vim
---

I have set up a [channel] for [GNU Guix] to build [Neovim]. This channel serves
as an experimental staging ground for porting Neovim (and perhaps other related
projects in the future) to the Guix functional package manager. When the
packages are deemed stable and correct enough they will be submitted to Guix
proper.


## What is functional package management?

The term "functional package management" comes from functional programming.

### Functional programming

Let us consider the mathematical function `f(x) = x^2`. Its return value
depends *only* on the argument (input) `x`, nothing else, it will not return
some other value on a full moon night or anything like that. We say that it
does not depend on any *state*. The other important thing is that the function
has no *side effects*, it does not change anything in the world as if it were a
magic spell.

~~~
     5
┌──╲   ╱──────┐      Function illustrated
│             │╱     as a machine. The input
│ f(x) = x^2    25   is 5 and the output is
│             │╲     the number 25
└─────────────┘
~~~

A function with these two properties is called *pure*. In mathematics all
functions are pure, but in programming this is not necessarily the case. The
return value of a function might depend on some external global variable and it
might have side effects like changing a global variable or printing something
to the screen. Functional programming aims to work with pure functions as much
as possible, although sooner or later some compromises have to be made. There
is a bit more to functional programming, but for our purposes these two
properties suffice.

### Functional package management

What does this have to do with package management? Consider a package
definition as a function: it takes in a number of packages and produces a
resulting package. In other words, instead of a function that maps several
numbers to another number, we have a function which maps several packages to
another package.

In the mathematical spirit we want our package definitions to be *pure*. This
means that the package may only depend on the packages explicitly listed as
dependencies (*inputs*), it must not use packages that are already installed on
the system, and it must not alter the system.

A built package is stored in the *store*, a directory containing all the built
packages. Since the packages are isolated from each other and only depend on
packages we have explicitly listed as inputs, we can have all sorts of packages
that would ordinarily conflict with each other.

In order to actually use those packages we still need to "install" them
somehow. This this is done by setting up a *profile*, a directory of
symbolic links to the actual binaries, libraries, scripts, manuals and whatever
else there is. Usually there is one default profile for the user, but it is
also possible to create new profiles on the fly, or roll back to a previous
profile.

Functional package management was first implemented by [Nix], and later
implemented by GNU Guix. Where Nix uses a custom language of their own, Guix
builds its language on top of [GNU Guile], so package writers can make use of
Scheme when defining their packages.


## The Neovim channel

Guix version 0.16 added [channels] as a new feature, which allow users to pull
in package definitions from unofficial sources as well. The manual explains it
in detail, but here is the TL;DR: create the file `~/.config/guix/channels.scm`
and add the following contents:

~~~scheme
(cons (channel
        (name 'neovim)
        (url "https://gitlab.com/HiPhish/neovim-guix-channel/"))
      %default-channels)
~~~

This will instruct Guix to use my channel in addition to the official default
channel. Now run `guix pull` in order to pull in the definitions from the new
channel and you should be good to go. In order to remove the channel remove
file file or just remove the `(channel (name 'neovim ...` expression.


[channel]: https://gitlab.com/HiPhish/neovim-guix-channel/
[GNU Guix]: https://www.gnu.org/software/guix/
[Neovim]: https://neovim.io/
[Nix]: https://nixos.org/
[GNU Guile]: https://www.gnu.org/software/guile/
[channels]: http://guix.info/manual/en/Channels.html
