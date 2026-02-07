---
title: Big change to rainbow-delimiters.nvim
tags: vim
category: vim
---

No, not another rewrite.  Much better than that: the long-standing ugliness of
highlighting being limited to only one node at a time has been fixed.
Previously only one opening node and one closing node could be highlighted.
This was perfectly adequate for most languages where you have one opening
parenthesis and one closing parenthesis.  However, consider HTML: we want to
highlight the opening and closing tag, but if we highlight the entire top-level
node we also highlight the attributes of the tag, which looks too vibrant.  The
alternative was highlighting the tag name, but this left the angle brackets
without highlighting, which looked jarring as well.

![Two comparison screenshots of HTML code, first one shows old state, second one the new state][comparison]

The above two screenshots show the highlighting before (top) and after
(bottom).  In the old screenshot the angle brackets are coloured differently
than the tag names, which makes the text look much noisier. In the bottom
screenshot the angle brackets match the tag names, which looks much more
uniform, especially for short tag names like `<p>`. In both cases the tag
attributes have their default highlighting.

This improvement is not exclusive to HTML.  In Lua we often have three
delimiters, for example loops have `for`, `do` and `end`.  We can now define a
query which will highlight all three delimiters instead of just the first two.
It just happens that HTML is the worst offender.

The solution came from [Daniel Kongsgaard] via GitHub PR.  He had the idea of
using `iter_captures` instead of `iter_matches` to iterate over the matched
nodes.  There was quite a lot more to be done, but in the end we persevered.
This does mean all the existing queries had to be rewritten.  End users won't
notice any difference, the new queries will just work.  New queries need to be
written for the new captures though.

I hope everyone else enjoys the new rainbow delimiters as well.

[comparison]: ./comparison.png "Comparison"
[Daniel Kongsgaard]: https://github.com/Danielkonge
