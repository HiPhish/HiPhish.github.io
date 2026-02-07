---
title: Project-local Vim settings the right way
category: vim
tags: vim, rant
---

Sometimes you want to have a set of Vim settings specific only to a certain
project. There are many tips out there how to achieve such a setup, but most of
them expose the user to serious security risks. I am going to describe the
fundamental problem and how to solve it. TL;DR: use the [vim-addon-local-vimrc]
plugin.

Unfortunately there is a very obvious but dangerous solution that gets promoted
on countless blogs and Stack Overflow questions which keep popping up in web
searches. I will first describe this naive solution and what exactly the
problem with it is, then I will outline the proper secure solution.


## The naive solution

This is the usual people recommend, which is not secure. We can create a file
in the root directory of the project, give it a predefined name like `init.vim`
and set up Vim to `:source` the file when it finds it:

```vim
for fname in ['init.vim', '.init.vim', 'vimrc', '.vimrc']
    if filereadable(fname)
        execute 'source' fname
        break
    endif
endfor
```

This is very bad! Whenever you open *any* file from a directory containing a
local settings file, the Vim Script file will be sourced. The file could
contain malicious code like

```vim
call system('rm -rf ~')
```

and Vim would execute it unconditionally. You might only want to take a look at
the README file of a project and you end up executing foreign code. Even worse,
if file file name starts with a period character (like `.init.vim`) you might
not even be aware that the file exists.

No problem, just `:set secure` and everything will be fine. It is called
`secure` for a reason after all, right? Wrong, the `secure` option is not good
enough, it is still possible to execute arbitrary code:

```vim
call feedkeys(":!rm -rf ~\n")
```

An attacker might not even have to go that extra mile, because according to the
manual “On Unix this option is only used if the ".nvimrc" or ".exrc" is not
owned by you” (see `:help 'secure'`). When you clone a git repository you are
the owner of all its files, and `secure` does absolutely nothing.


## The secure solution

The only way to be on the safe side is to inspect the settings file yourself
before sourcing it. To prevent being caught by surprise when we open a file we
can prompt for confirmation.

```vim
for fname in ['init.vim', '.init.vim', 'vimrc', '.vimrc']
    if filereadable(fname)
        if input('Do you wish to load ' .. fname .. ' ?') == 'yes'
            execute 'source' fname
        endif
        break
    endif
endfor
```

This does defeat automation though, we now have to manually confirm it every
time. If we get used to typing `yes` every single time we might miss when the
file contents change right under our nose (e.g. after a `git pull`) and confirm
the use of a now malicious file.

To solve this issue we need to remember which files have been confirmed and do
not prompt for those as long as the file contents remain unchanged. We can
store our previous choices along with the file hashes in a database of sorts.
When a settings file is detected perform the following steps:

1. Has the file been previously confirmed or denied? If not, go to step 4.
2. Is the hash of the current file the same as the stored hash? If not, go to
   step 4.
3. Go to step 6.
4. Prompt the user.
5. Record the choice along with the current file hash.
6. Source or ignore the file based on the stored settings.

We need to find a sufficiently good hashing algorithm and a way of storing the
choices in a database or file and retrieving them again. The plugin
[vim-addon-local-vimrc] does all of these things already, so there is no need
to re-invent the wheel.


## Conclusion

- The naive approach is dangerous because of unconditional foreign code
	execution (i.e. you think you are only reading a file, but something else
	happens in the background)
- Instead ask the user before sourcing a new or changed file
- Store the settings to avoid repeated prompting (people form habits and start
	accepting things without thinking first)
- Use a file hash to detect whether a file has changed
- The [vim-addon-local-vimrc] plugin implements all of the above steps


[vim-addon-local-vimrc]: https://github.com/MarcWeber/vim-addon-local-vimrc
