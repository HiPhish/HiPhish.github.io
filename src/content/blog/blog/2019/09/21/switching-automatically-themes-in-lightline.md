---
title: Switching themes automatically in lightline.vim
category: vim
tags: vim
---

I have recently switched my [Neovim] setup to use [lightline.vim] and at the
same time I was experimenting with colour schemes. Getting lightline to switch
colours along with the rest of the editor is non-trivial, but I think I have
figured it out, so I am going to share my setup.

## A word about colour schemes

If you are already an expert on Vim colour schemes feel free to skip this
section.

When you execute the command `:colorscheme derp` Vim will search the
`runtimepath`s (see `:h 'runtimepath'`) for the file `colors/derp.vim` and
source it. If there are multiple such files, the first one found will be
loaded. This means that you cannot have two definitions for `derp` where one
overrides or complements the other, only one of them will be sourced. See `:h
:colorschme` for full details.

Vim does not really have a notion of a colour scheme, the `:colorscheme`
command only locates the file and sources it, which in turn executes all the
ex-commands contained in the file. Usually these commands set various colours
used by Vim, but in theory the commands could do anything. It also means that
setting colours is not limited to a colour scheme file, we can set our colours
anywhere.

As a side effect of executing `:colorscheme` the variable `g:colors_name` will
be set to the name of the colour scheme. This variable allows us to act as if
Vim had self-contained colour schemes. Actually, there is a small catch: a
colour scheme has to explicitly set this variable, it will not be set
automatically. So if the author of the `derp` colour scheme forgot to set it
when the scheme is loaded, Vim will think that no colour scheme was set. In
that case it would be best to send a patch to the author or fix it locally with
an autocommand:

```vim
augroup colorscheme-overrides
	autocmd!
	autocmd ColorScheme derp let g:colors_name = 'derp'
augroup END
```



## How to do it

Here is our strategy: when the user changes the colour scheme we call a
function which finds the correct lightline colour palette file, sources it, and
then re-initialises lightline. The following code can be placed anywhere in
your Vim configuration; personally I prefer to create the file
`plugin/lightline.vim` in my Vim configuration directory.


First we set up an autocommand to call whenever the colour scheme changes.

```vim
augroup lightline-events
	autocmd!
	autocmd ColorScheme * call s:onColorSchemeChange(expand("<amatch>"))
augroup END
```

Next we must actually write that function. How do we find out which file to
source? The lightline manual describes for plugin authors how to create their
own schemes (see `:h lightline-colorscheme`). The relevant portion is this:

    In each file, one global variable is defined. For example, in the
    landscape.vim file, you see

        let g:lightline#colorscheme#landscape#palette = s:p

If we recall how autoloading works, this means that we are interested in the
file `lightline/colorscheme/landscape.vim` (see `:h autoload`). But what if the
names do not match? The [NeoSolarized] colour scheme is a variant of
[Solarized] and does not provide its own lightline scheme, so I would like to
load the Solarized scheme which comes bundled with lightline instead. For this
purpose a dictionary is good enough:

```vim
let s:colour_scheme_map = {'NeoSolarized': 'solarized'}
```

With all this out of the way we can finally write the callback function.

```vim
function! s:onColorSchemeChange(scheme)
	" Try a scheme provided already
	execute 'runtime autoload/lightline/colorscheme/'.a:scheme.'.vim'
	if exists('g:lightline#colorscheme#{a:scheme}#palette')
		let g:lightline.colorscheme = a:scheme
	else  " Try falling back to a known colour scheme
		let l:colors_name = get(s:colour_scheme_map, a:scheme, '')
		if empty(l:colors_name)
			return
		else
			let g:lightline.colorscheme = l:colors_name
		endif
	endif
	call lightline#init()
	call lightline#colorscheme()
	call lightline#update()
endfunction
```

The reason we execute `runtime` with the file name as argument is to make sure
it is sourced, otherwise the following `if` block would not find the variable.

We are almost done, there are just a few things to take care of. First we need
to call our function *if* it is defined after the colour scheme has been set.
In my case I set my colour scheme in my `init.vim` (or `vimrc` for Vim), which
is going to be sourced before `plugin/lightline.vim`, so I have to add the
following line after the function definition:

```vim
call s:onColorSchemeChange(g:colors_name)
```


[Neovim]: https://neovim.io/
[lightline.vim]: https://github.com/itchyny/lightline.vim
[NeoSolarized]: https://github.com/icymind/NeoSolarized
[Solarized]: https://ethanschoonover.com/solarized/
