:title: Whitelisting subdirectories in Git
:date: 2014-09-09
:tags: old-blog, how-to
:subsite: grid-framework

After having migrated the development of Grid Framework to Git I wanted to set
it up to track only certain sub-directories. I turned out that whitelisting is
quite tricky, so here is how I did it for people who might run into the same
problem.

We'll use only one .gitignore file and it will be placed in the root of our
repository, which is also the root of our project. We can do the usual
blacklisting stuff like blacklisting ceretain file types and directories, but
the Assets directory is where it gets tricky. Since the directory contains all
sorts of other plugins used during development but not worth tracking, we can
neither black- nor whitelist the entire directory.

First we'll blacklist all the contents of the Assets directory. Note that this
does not blacklist the directory itself, just its contents, but since Git
operates on files the effect is the same. The difference is that blacklisting
an entire directory prevents us from ever whitelisting any of its contents.

.. code::

   Assets/*

Now we can whitelist a subdirectory and its meta file:

.. code::

   !Assets/Grid\ Framework/
   !Assets/Grid\ Framework.meta

Simple enough, but what if we want to whitelist only a specific subdirectory of
a subdirectory? The Editor directory contains code from other plugins as well,
so we don't want to track the entire thing. In this case we need to repeat the
same process as above but one level deeper.

.. code::

   !Assets/Editor/
   !Assets/Editor.meta
   Assets/Editor/*
   !Assets/Editor/Grid\ Framework/
   !Assets/Editor/Grid\ Framework.meta

First we whitelist the Editor directory, then we immediately blacklist its
contents and whitelist a specific subdirectory. This way none of the other
editor extensions will be tracked. We can repeat the same process for the
Plugins directory.

.. code::

   !Assets/Plugins/
   !Assets/Plugins.meta
   Assets/Plugins/*
   !Assets/Plugins/Grid\ Framework/
   !Assets/Plugins/Grid\ Framework.meta

And yes, you do have to repeat all these steps for every level of
subdirectories. You don't have to whitelist subdirectories of already
whitelisted directories, so any subdirectory in ``Assets/Editor/Grid\
Framework/`` is already tracked. Also note the backslash in the path, it is
necessay to escape the space character.

**UPDATE:** Whitelisted the Unity meta files of whitelisted folders as well,
just in case. Of course if you are not using Unity you need to figure out if
and what meta files you have instead and if they need to be tracked as well.

