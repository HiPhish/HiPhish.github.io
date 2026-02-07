---
title: Git packages or embedded packages? Yes.
category: progress
tags: how-to, packages
---

In my [previous post] I wrote about how I maintain the optional extra packages
to Grid Framework. Since this point is useful for working with Unity in general
I think it's worth elaborating upon the topic in a separate post.


## The different kinds of packages

There are three different kinds of custom packages:

- embedded packages
- local packages
- Git packages

An embedded package resides inside the project itself, where it is contained
within a directory inside the `Packages` directory. Embedded package have the
advantage that their code is actually part of the project and as such we can
work on the code directly. As such our code tooling (like [Omnisharp] or an
IDE) can operate on the code of the package. Embedded packages cannot be shared
among projects.

A local package resides within a directory on our file system but outside the
project. Local packages can be shared among projects and we can work on their
code, but we cannot do so within the context of a Unity project. This is not
much of a deal if our package does not contain code though.

A Git package is a Git repository, usually on a remote server. Git packages are
ideal for sharing a project among multiple machines, but we cannot work on them
directly. Of course we can clone the repository and work on it, but we cannot
work on the original package directly. Git packages are great if we want to
make the package distributable.


## The problem I want to solve

My addon packages have two target audiences: me as their developer, and you as
their end users. I want the packages to be as easy to install as possible, so a
Git package is ideal. I can tag individual releases and users can then choose
which version they want.

On the other hand the packages contain code and I need to work on it. For this
purpose an embedded package would be ideal. Yet I still need to be able to tag
releases and switch branches without having to affect all of Grid Framework.
There is no reason I should have to branch off the entire project just because
the add-on has an issue.


## Git submodules give us the best of both world

Git has a feature called *submodules*, which lets us put Git repositories
inside Git repositories. Normally we should use a proper package manager for
managing dependencies, but sometimes a submodule is exactly what we need. In
our case we want the remote package to be stored inside the Unity project as if
it were a local package. Fortunately Unity does no require any different file
structure or metadata for the different kinds of packages.

Assuming we are in the repository of the project we can add the submodule using
this command:

```sh
git submodule add <path-to-origin> Packages/com.hiphish.grid-framework.playmaker
git submodule add <path-to-origin> Packages/com.hiphish.grid-framework.vectrosity
```

The last parameter is important, it tells Git under which path to save the
repository. This is effectively it, we can now use the package in our project,
we can `cd` into the submodule and work there. We will probably want to set up
which branch to follow, so we can execute the following in our shell:

```
git config -f .gitmodules submodule.source/Packages/com.hiphish.grid-framework.playmaker.branch master
git config -f .gitmodules submodule.source/Packages/com.hiphish.grid-framework.vectrosity.branch master
```

Or add a `branch` entry to our `.gitmodules` file inside the main repository:

```
[submodule "source/Packages/com.hiphish.grid-framework.playmaker"]
	path = source/Packages/com.hiphish.grid-framework.playmaker
	url = git@gitlab.com:HiPhish/grid-framework-playmaker.git
	branch = master
[submodule "source/Packages/com.hiphish.grid-framework.vectrosity"]
	path = source/Packages/com.hiphish.grid-framework.vectrosity
	url = git@gitlab.com:HiPhish/grid-framework-vectrosity.git
	branch = master
```


## Conclusion

TL;DR: Make your package a Git repository, add it as a Git submodule to your
main project repository and make sure to set the correct path so Unity sees it
as an embedded package. Work on the copy inside your main project, commit and
tag there, then push to the origin. Users can use the origin as a Git package
in their own projects. For more information refer to the official Git
documentation: `git help submodules`

[previous post]: /grid-framework/news/2021/07/31/vectrosity-support-as-package/
[Omnisharp]: https://www.omnisharp.net/
