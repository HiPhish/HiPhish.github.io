---
title: Writing NCM2 sources
category: vim
tags: vim
---

[NCM2] is a plugin for Neovim and Vim which provides users with a unified
completion menu. By default it displays nothing, users need to add *sources*
for completion. These plugins instruct NCM2 on how to get completion candidates
for a particular use-case, such as words in the current buffer, or function
names in a programming language. The NCM2 documentation explains how to write
the individual pieces of a source, and in this blog post I am going to dive
into how to connect those pieces into a working source.

We will start out with a simple synchronous source and finish with a case-study
of my asynchronous [ncm2-vlime] source. Along the way I will be pointing out
the relevant entries in the NCM2 manual for context.


## Source for the day of the month

Let us start with a simple source which fills in the day of the month. Set up
the Vim plugin as usual first, then create the directory `ncm2-plugin`. NCM2
will search all runtime directories for the `ncm2-plugin` directory and load
all Vimscript and Python files it finds there.

We will be using Vimscript for our sources because it is the canonical and
ubiquitous language for scripting Vim. Create a new file named
`ncm2-plugin/months.vim` (the name of the file does not really matter). We can
now define our source in this file.

```vim
let s:months_source = {
    \ 'name': 'Months',
    \ 'mark': 'Month',
    \ 'enable': 1,
    \ 'ready': 1,
    \ 'priority': 2,
    \ 'word_pattern': '[a-zA-Z]+',
    \ 'complete_length': 2}
```

A source definition (see `ncm2#register_source()`) is a dictionary with certain
entries, some of which are optional. The values so far are self-explanatory. Do
keep in mind that the regular expression patterns are in PCRE format, not in
Vim's format. In particular this means you cannot use things like the `\v`
magic flag.

So far we have only specified passive properties of the source, but we also
need to instruct NCM2 on how to actively complete the text. This is done by
specifying a callback function which will be called by NCM2.

```vim
" Completions results are always the same
let s:months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    \ 'August', 'September', 'October', 'November', 'December']

" The callback function
function! s:complete_month(context)
    call ncm2#complete(a:context, a:context.startccol, s:months)
endfunction

" Add the callback to the source defintion
let s:months_source['on_complete'] = function('s:complete_month')
```

Completion in NCM2 is a two-step process: NCM2 analyses our input and when
there is something to complete it calls the callback function of a source. This
in itself does not present any completion results to the user yet, it just
gives the source power to decide what is to be done next. In the case of such a
simple source we can tell NCM2 right away what the completion results are.

The callback function takes one argument (a dictionary describing the
`ncm2#context` in which completion was triggered) and returns no result. The
`ncm2#complete()` function takes three arguments: a context, the first column
(counted in character) and the list of completion results.

Why have such a two-step process? In a more complicated case we might not have
all the results yet, and computing them all might take a while. If we had to
return the completion results right away this would block the entire editor.
Instead we can delay the decision by calling some asynchronous function and
return right away. The editor remains responsive and the popup-menu will show
once completion results are available.

Finally we need to register the source to make it available in NCM2.

```vim
call ncm2#register_source(s:months_source)
```

We can now start the editor, start typing the name of a month and see its name
being completed. Since our source has no `scope` entry the source will work for
any file type.


## Case-study: `ncm2-vlime`

Let us now consider how one might write an asynchronous completion source. The
definition of the source is similar to above, so I will skip over it. The
callback function is defined as follows:

```vim
function! ncm2#vlime#on_complete(context)
    let l:connection = vlime#connection#Get(v:true)
    call l:connection.SimpleCompletions(a:context.base, {c,r->ncm2#vlime#complete_simple(a:context, r)})
endfunction
```

I have omitted some boilerplate code and the error checking. As it happens,
Vlime already provides an asynchronous way of getting completion, so we can
focus on just connecting the wires: we get a connection object (a Vimscript
dictionary) and call its `SimpleCompletions` method. This method is
asynchronous, it does not return any result, but it lets us specify a function
to call when the results are available. The function takes two arguments: the
connection (`c`) and a list of results (`r`).

This is where the two-step process comes in. The callback is a lambda
(anonymous function) which calls another function. To recapitulate: NCM2 calls
the callback of a source, the callback then tells Vlime to fetch completion
results and what to do when the results are in, then returns. When Vlime is
done fetching completion results its own callback calls the following function:

```vim
function! ncm2#vlime#complete_simple(context, result)
    let l:matches = a:result[0]
    let l:startccol = a:context.startccol
    call ncm2#complete(a:context, l:startccol, l:matches)
endfunction
```

Just as in the example with the months, the function receives the completion
context and a list of results. Depending on the format of the results we might
need to do some transformation of them first, but other than that this is
effectively all there is to it.


## Conclusion

Defining a source requires us to ask two questions: what to do when completion
is requested, and what to do when the results are in. In the case of simple and
synchronous sources both questions are one, but more complex and asynchronous
plugins must consider those two questions separately. I have tried to
illustrate the process here:

```
  [ Completion gets requested ]
                 |
                 |
                 V
[ Callback of the source called ] ---> [ Completion callback gets set up ]
                 |                                      |
                 |                                      |
                 V                                      V
    [ Resume Editor control ]                  [ Compute results ]
                 |                                      |
                 |                                      |
                 V                                      V
      [ User keeps typing ]                  [ Present completions ]
                 |                                      |
                 +--------------------------------------+
                 |
                 V
      [ Apply completions ]
```

The left-hand column represents the main sequence of execution. In the second
step a parallel sequence of execution is set up, which eventually merges back
into the original sequence.

[NCM2]: https://github.com/ncm2/ncm2
[Vlime]: https://github.com/l04m33/vlime/
[ncm2-vlime]: https://gitlab.com/HiPhish/ncm2-vlime
