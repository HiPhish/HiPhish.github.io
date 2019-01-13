title: Neovim has tab-local working directories now
tags: vim
category: open-source
---

My Neovim PR to add tab-local working directories has recently been merged.  In
this post I will explain what it does and why you will love it.


## What are working directories in Vim?

If you know Vim  feel free to skip  this section,  otherwise read on.  Vim is a
terminal application  and the  directory you  launch it  from is  the  *working
directory* for  that session.  Even if you use a  GUI version of Vim you have a
working directory which  usually defaults to your home directory.  Any time you
issue an ex-command  or call a shell command  all paths will be  interpreted as
relative to the current working directory.

Take for  instance the `:make` ex-command.  It will call your make program from
the working  directory  and  that program  will usually  search for  a sort  of
makefile  in  that  directory.  Let's  assume you have  a C project  in its own
directory and a makefile in that directory as well.  If Vim's working directory
is the same as the project  directory you  can run `:make` and have the project
built immediately.

This isn't limited  to just `:make` alone,  any file navigation also depends on
it. If you have a file browser plugin like  Netrw or NERDTree installed you can
just issue the  ex-command `:edit .`  and browse your  project directory.  File
finders like Ctrl-P or Unite would have to go through a huge tree of completely
unrelated directories before they reach the sub-tree of your project. There are
many more examples,  but the point is that  your working directory should match
your project directory.


## The motivation for tab-local working directories

Sometimes you  need to  work  on more  than one project  at a  time.  Take this
website:  There is the website itself, which is one project,  and there are the
Jinja  templates,  which is  another project.  Sometimes I  find a  bug in  the
website and I have to switch to the template project.  I could launch a new Vim
instance, but the instances would be completely isolated. I couldn't transplant
HTML  snippets  from  one  into the  other without  going  through  the  system
clipboard.  Searches issued in  one instance  would not appear in the other,  I
would  have  to  repeat  them  but  that  can  be  really  annoying in  case of
complicated regexes.

The idea to implement this  feature can from a Vim [screencast by Drew Neil].
In it for some reason  his build of Vim does  have separate working directories
for each tab by default. He seems to think that's a regular feature, but if you
take a look at the comment section you will see that it clearly is not. My best
guess is that it was a bug,  but even after working with the internals of Vim I
cannot imagine how it could have happened.

[screencast by Drew Neil]: http://vimcasts.org/episodes/how-to-use-tabs/

There is a Vim plugin called [vim-tabpagecd] which makes all tabs have their
own working directory by default.  I was using it for a while, but giving every
tab its own working directory every time seems overkill to me.  So the only
natural course of action was to implement it in Vim directly.

[vim-tabpagecd]: https://github.com/kana/vim-tabpagecd


## The `:tcd` ex-command

I modified Neovim instead of Vim because that's the editor I actually use,  but
if anyone wants  to port this feature  to Vim be my guest.  Anyway, Vim already
has a  similar feature  in the  `:lcd` command,  except that  that  command  is
limited to just one window.  I decided the call my command `:tcd`;  it's short,
easy to remember and it if you know `:lcd` you also know `:tcd`.

Working directories take precedence over each other with deeper ones overriding
higher ones.  In practice this means that  `:tcd` overrides  the global working
directory and that `:lcd` overrides the tab-local working directory.

Bigger changes had to be made to the `getcwd()` function. In order to not break
backwards compatibility the function will still work without any arguments,  in
which case  it returns  the effective  working  directory.  If you  supply  one
argument it is  taken to be the number  of the window in the *current* tab,  so
you get that window's  effective working directory.  So far this is the same as
in Vim.  However, if you supply a second argument  it is taken to be the number
of a tab. In other words `getcwd(3, 2)` returns the effective working directory
of window number  3 in tab number 2.  You can  always use the  number 0 for the
current window  or tab.  Here is where  it gets  interesting:  if you  want the
working directory of a tab regardless  what the working directory of the window
is you supply -1 as  the number of the window.  Even if the window  has its own
local working directory it will be ignored.

The function `haslocaldir()`  works exactly the  same as `getcwd()`,  except it
returns whether the working directory is local to that scope.


## Even more scopes?

A major part  of Neovim's missions  statement is to  bring the codebase  of Vim
into a better state.  The tab-local working directory  feature hasn't been just
bolted onto the existing code, I have properly refactored the inner workings so
that adding a new scope  should take only a few lines of code from now on.  One
could  for example  add a "buffer"  scope that takes  precedence over  tabs and
affects all windows displaying that buffer.  Of course such a scope would raise
new design concerns and it's questionable whether it would even be useful,  but
the important point is that it is now possible.
