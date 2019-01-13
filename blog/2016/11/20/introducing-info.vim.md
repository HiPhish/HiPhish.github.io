title: Introducing info.vim
tags: vim, info
category: info.vim
---

There is a new project up at the Workshop: [info.vim], a Vim plugin which
implements a complete reader and browser for info documents from within Vim.
This is similar to the standalone `info` program or the Emacs info mode.

[info.vim]: https://gitlab.com/HiPhish/info.vim

Info documents  are generally produced by  the [Texinfo] program, which  is also
the official documentation format for the GNU project. This means that a lot of
important manuals, such  as the Bourne Again Shell user  manual, are written in
this format. One could  read the manual in HTML or PDF,  but that means leaving
the editor and  interrupting the workflow. Another alternative would  be to run
standalone `info` from within a Neovim terminal buffer, but even that's more of
a workaround than a  real solution, plus you have to  learn the weird interface
of standalone  `info`. Until  now Vim  users had  no real  way of  reading info
documents without interruption.

[Texinfo]: https://www.gnu.org/software/texinfo/


## A new info reader

The best way to get  and idea of info.vim is to see it  right in action in this
asccicast:

[![Screencast of using Info.vim](https://asciinema.org/a/92884.png)](https://asciinema.org/a/92884)

Opening the manual to the Bourne Again Shell is as easy as typing

~~~vim
:Info bash
~~~

on the Vim command line. Similar to  standalone `info` you can also give a node
to jump to:

~~~vim
:Info bash introduction
~~~

Info.vim uses the same way of finding  files and nodes as standalone `info`, so
even  a short  form like  `:Info bash intro`  would  find the  right node.  The
command will open a new window or  use an existing window, similar to how Vim's
`:help` works.  You can even  use the same  modifier like `:vertical`,  it will
works exactly as you would expect.


## Navigating info documents

Of course reading a  node of the manual is only half  of what an implementation
of info  should provide.  The other  half is navigating  the manual.  For every
navigation  a corresponding  Vim command  is provided:  `:InfoUp`, `:InfoNext`,
`:InfoPrev`,  `:Menu`,   `:Follow`  and   `:GotoNode`.  All   commands  support
tab-completion (where  applicable) and there  is a  prompt version of  each one
that can be mapped to a key by the user:

~~~vim
nmap <buffer> gu <Plug>InfoUp
nmap <buffer> gn <Plug>InfoNext
nmap <buffer> gp <Plug>InfoPrev
nmap <buffer> gm <Plug>InfoMenu
nmap <buffer> gf <Plug>InfoFollow
nmap <buffer> go <Plug>InfoGoto
~~~


## Advanced info

For those who like  to dig deeper into the meat and build  their own scripts on
top of  info.vim there are two  very handy features: the  `b:info` variable and
info URIs. `b:info`  is a buffer-local dictionary that  holds information about
the current node, such  as sibling nodes, its file or a list  of menu items. An
info URI  is a  special URI  that can be  used to  identify info  documents. By
executing

~~~vim
" We had to escape the '%' with '\%' because of Vim
:edit info://bash.info/What\%20is\%20Bash\%3f/
~~~

you will  open the corresponding node  right in your current  window. Much like
with the `:Info` command you can  also use a short URI like `info://bash/what`.
Info.vim  is clever  and will  normalise  your URI  so  you don't  end up  with
multiple buffers all displaying the same content. With this of normalisation in
place we can  even add extra information  to the URI's query, like  a line- and
column number:

~~~vim
:edit info:/bash.info/What\%20is\%20Bash\%3f/?line=3&column=7
~~~

So go ahead, download info.vim and browse all those info manuals that have been
collecting dust  on your  hard drive  so far,  and don't  forget to  report any
issues you might come across.
