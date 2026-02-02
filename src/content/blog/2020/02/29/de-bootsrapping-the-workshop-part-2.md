---
title: De-Bootsrapping the workshop, part 2
category: organisation
tags: html, rant
---

About a year ago I wrote about the [first step in
de-Bootstrapping](/blog/2019/02/04/de-bootstrapping-part-1/) my website, where
I made my site layout independent of the [Bootstrap](https://getbootstrap.com/)
CSS framework. I have now finally removed Bootstrap entirely from the website.


## CSS frameworks are bloat

I still stand by what I said about Bootstrap: it is a good solution if you want
to have a given layout work on as many devices as reasonably possible. The real
question however is whether what you want is really what you should be doing.

What I mean by this is that the Web is not PDF, it was never meant to look the
same on every device. Even in the earliest days some users might visit a page
using a graphical web browser, while some users might visit the page using a
text-based web browser in a terminal. HTML was designed to be able render
reasonably on all kinds of user agents, but sadly people started forcing style
information over time into what was meant to be pure content.

Even after moving styling to CSS it was not until very recently with the
introduction of Flexbox and CSS Grids that making complex layouts in pure CSS
became feasible. Most of the web development woes come from the simple fact
that we are trying to use the web for what it was never intended to be. My
Bootstrap-based HTML was full to the brink with semantically worthless elements
only to make the layout work on all relevant browsers (whatever “relevant”
might mean).


## Learning to let go

So what if my layout does not look the same everywhere? As long as it is
*comprehensive* to the reader, the layout should not matter. This change in
perspective means that the content becomes the most important part of the page,
not the layout. The layout is just eye-candy that is applied to the content,
and the HTML is purely semantic content.  Because of the way CSS works, when a
feature is encountered which the CSS implementation does not understand, it
will simply be skipped. Careful design allows the layout thus to gracefully
degrade for older browsers. No more worrying about “mobile first” or any other
such nonsense, if it is well-designed it will look good anywhere.

Take for example this blog: it uses CSS grids to lay out a navigation bar on
the left-hand side, and on the right-hand side a vertical stack of breadcrumbs,
the actual content, and finally a pager are drawn. What if the browser does not
support CSS grids though? The `display: grid` property will be ignored and the
side bar becomes a panel beneath the pager. It is not the kind of layout I
would like, but it is still acceptable. Just learn to let go, and if a layout
cannot be achieved without hacks, then perhaps it is better not to force it.

Of course if your boss or client demands that the layout *has* to be a certain
way on all devices, you don't really have a choice. In that case just throw
Bootstrap in there and never look back.


## Yeah, well, that's just, like, your opinion, man

No, [it is not](https://invidio.us/watch?v=u00FY9vADfQ). Stop fighting the
solution.


## Cleaning up

Removing a framework that is so deeply integrated could not be done in a clean
way, and the current CSS is full of leftovers and code duplication. The hardest
part is over, now I can slowly clean it up, remove duplication, and perhaps
switch to a CSS preprocessor. I would also like to eventually implement a dark
theme. It's good to be back in control.
