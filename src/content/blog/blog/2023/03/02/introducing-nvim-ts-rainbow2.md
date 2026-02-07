---
title: Introducing nvim-ts-rainbow2
tags: vim
category: vim
---

Two months in the making, it is time to finally release my new Neovim plugin
officially: [nvim-ts-rainbow2] ([GitHub
mirror](https://github.com/HiPhish/nvim-ts-rainbow2)).  This plugin uses
Neovim's built-in [Tree-sitter] support to add alternating highlighting to
delimiters.  This is usually known as “rainbow parentheses”, but thanks to
Tree-sitter we are not limited to parentheses, we can match any kind of
delimiter, such as tags in HTML or `begin`/`end` blocks in some programming
languages.

This plugin is actually a fork of [nvim-ts-rainbow], hence the number two in
the name.


## Motivation for forking

The original project was declared abandoned in early January of 2023.  Before
that I was working on a patch which would allow to highlight only the portion
that the cursor is currently in.  I vaguely remember seeing once an animation
of such a feature in Emacs.  The user was editing a piece of Lisp code and only
the expression which contained the cursor had rainbow parentheses.  With every
delimiter highlighted the source code can easily start looking like a Christmas
tree, so local highlighting was something I really wanted in Neovim.

I had written a somewhat hacky patch and was prepared to open a pull request
when I found that the plugin had been abandoned.  So I did a hard fork and
restructured pretty much the entire thing over the course of two months to fit
my vision.


## What's new?

TL;DR: we now have separate queries and strategies which we can mix and combine
per language.  The query tells us what to match while the strategy tells us how
to highlight those matches.

I find that software is best not when there are no more features to add, but
when there are no more features to remove.  Case in point, the last phase
before the release was me taking an axe to the API and just chopping off what I
could do without.  This means nvim-ts-rainbow2 has fewer options than the
original, but all of the remaining options are more powerful.

Here is an example configuration:

```lua
local rainbow = require 'ts-rainbow'
require("nvim-treesitter.configs").setup {
  rainbow = {
    query = {
      'rainbow-parens',
      html = 'rainbow-tags'
    },
    strategy = {
       rainbow.strategy.global,
       commonlisp = rainbow.strategy['local'],
     },
  }
}
```

Here we highlight all parentheses by default. However, in HTML we highlight
tags instead and in Common Lisp we highlight only the current cursor position.


### Queries

The original plugin had an `extended_mode` setting; turning it on would in some
languages match more complicated patterns like HTML tags.  This has a number of
problems:

- Not all languages support an extended mode
- There might be multiple possibilities for what an extended mode could entail
- The highlighting code now has to handle special cases depending on the
  language

My solution was to instead leverage Neovim's query support.  A query is a set
of patterns that describe what parts of the document match which parts of a
pattern,  such as the opening and closing parentheses of a function call.  The
user only has to name the query and Neovim will use it in matching, no need for
special cases in our code.  We can have any number of queries per language, so
we are no longer locked into a binary either-or choice.  Users can write their
own queries if they don't like the default ones or if they want to support a
new language.


### Strategies

The strategy defines how to perform the matching.  Since this is Lua and we can
have executable code in our configuration, each strategy is a table with two
functions.  There are two strategies included:

- The global strategy highlights the entire buffer
- The local strategy only highlights the part containing the cursor

Separating queries and strategies lets us combine them arbitrarily.  This
further removes the need for special cases in the implementation.  The strategy
is only concerned with highlighting the matches it receives from the query, not
with what the query does.


### Correct levels out of the box

The original plugin had a table which contained the names of nodes to
highlight.  This was brittle because not all nodes had names and because the
level of ancestry between nodes was not the same for all languages.

The fork uses knowledge of the order of matches returned by Tree-sitter to
always do the right thing.  This makes determining the level of nesting much
more robust because it is automatic now.  I am actually quite proud of this one
because knowing the order of matches also enabled a number of other
optimizations.


### Everything comes at a price

The individual features are more powerful, but they are also more complicated
to implement.  The end user won't notice any difference, but those who
implement queries and strategies will have more work to do.

Queries now define up to four capture groups: the container which is delimited,
the opening and closing delimiters, and intermediate delimiters.  Here is what
a pattern for variable expansion in Bash looks like:

```
(expansion
  (("${" @opening)
   (":-" @intermediate)?
   ("}" @closing))) @container
```

This is more complicated than the queries of the original plugin, and we have
to write similar patterns for any other type of container even if the
delimiters all look the same.  This was the only way to have enough semantic
information to make informed decisions in the strategy.

A strategy is a table with two functions, one called when attaching to a buffer
and one called when detaching from a buffer.  This is similar to implementing a
protocol (or interface if you come from Java) in object-oriented programming.

```lua
local my_strategy = {
  on_attach = function(bufnr, settings)
    -- ...
  end
  on_detach = function(bufnr)
    -- ...
  end
}
```


### Help wanted

There are only so many languages that I know well enough to write queries for.
Some nice people have already provided queries for some other languages, but
there is still lots of work to do.  Unlike previous rainbow plugins we cannot
fall back on some generic regular expression, each language needs
custom queries.

If you are interested in contributing and know enough about Tree-sitter you can
try your hand on writing a query.  The user manual explains how to write them
and the `CONTRIBUTING` file has additional information.

I recommend first adding the query to your personal configuration and using it
for a while.  New queries do not need to be part of this plugin.  As long as
Neovim can find a query, it can be used by the plugin.  When you are satisfied
with the result please consider sending it upstream.

I hope you all find this plugin as useful as I do.


[nvim-ts-rainbow2]: https://gitlab.com/HiPhish/nvim-ts-rainbow2
[Tree-sitter]: https://tree-sitter.github.io/tree-sitter/
[nvim-ts-rainbow]: https://sr.ht/~p00f/nvim-ts-rainbow/
