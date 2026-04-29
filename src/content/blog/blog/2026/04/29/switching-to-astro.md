---
title: Switching to Astro
category: organisation
tags: [html, web, javascript]
---

I really, really did not want to do this, but I have rewritten this website
*again* from scratch.  This time I'm going all in on the JavaScript ecosystem:
TypeScript, Tailwind and Astro.  And no, I'm not kidding.


## How I go to where I am

The very first version of this website was written some time in 2015 or perhaps
earlier, more than a decade ago, when I need some homepage for Grid Framework.
Back then I had written it all by hand, every single line of HTML and CSS.  It
was not fun, HTML does not have any facilities for reusing code, loops or
variables.  I did look at the web ecosystem, at Node, NPM and whatever other
stuff was out there.  I did not understand how any of those pieces fit together
and what was what (and I'm still not sure I do). In my defense, the world of
JavaScript was much different back then, there were other package managers and
task runners and different bundlers, what you read was already outdated the
next year (these days it's more like two years).  It was hard to make sense of
any of it.

That was when I discovered static site generators. Their templating systems
augmented HTML with all the facilities I would expect from a programming
language.  I picked [Pelican], it was a good SSG and it made me learn Python,
which would eventually become my dayjob language.  However, the downside with
SSGs is that they tend to be opinionated.  You get a homepage, a blog and any
number of static pages.  If that's all you want they are great, but in my case
I wanted two blogs: one for my own stuff and one for Grid Framework.  That way
people who only cared about Grid Framework would not get spammed by all the
other stuff, and vice-versa.  I managed to write a plugin, but it had issues
because Pelican was never meant to work that way.  What I needed was an
unopinionated SSG.

Around that time I was reading [SICP] and learning Lisp.  It is a rite of
passage for Lispers to generate their own HTML from Lisp, so I went down that
rabbit hole.  At first I wrote a bunch of [GNU Guile] code to ad-hoc generate
this website and nothing else.  Later I used the lessons learned from that to
build an unopinionated hackable static site generator in Common Lisp:
[cl-hssg].

As far as flexibility goes HSSG is the bee's knees, you can generate any
website.  The entire thing is written in Lisp and extensible, the entire
templating engine is just a Lisp macro.


## Where it went wrong

If HSSG is so great, what happened?  The world of Lisp is a small and lonely
one.  Writing the core of a static site generator was easy, but there is so
much more to web frontends: dependency management, bundling, tree shaking, hot
module replacement, and more thing I cannot even imagine.  And for better or
worse all the action is in JavaScript land.  It would be a lot of effort just
to rebuild all of that in Common Lisp.  The alternative would be to mix two
ecosystem, but then what is the point of having Common Lisp around?


## Discovering Astro

The first time I heard of Astro was in January this year when they joined
Cloudflare.  I thought it would be just another single-page application
framework, but to my surprise Astro was actually exactly what I was trying to
accomplish with HSSG, except better.  In its simplest form Astro is an
unopinionated static site generator.  Unlike an opinionated SSG like Pelican,
Astro only gives you the building blocks but leaves it up to you what you want
to build.

Since Astro lives in the JavaScript ecosystem it integrates seamlessly with the
rest of it.  I can use Vite for development and building, Tailwind for styling
and Storybook for designing.  Whenever I want to include a dependency in the
frontend (like a gallery script) I can use pnpm to manage the dependency
instead of vendoring a minified JavaScript.  All my dependencies are tracked
cleanly.

I used to be a Tailwind hater, and in a way I still am.  I still find it
absolutely abominable to write `<div>`-soups and add fifty utility classes to
each element.  But guess what?  You don't actually have to do that!  You can
use Tailwind classes inside separate CSS files via the `@apply` directive.  My
mind was blow, why on earth does everyone advertise the worst part of Tailwind?
This one realisation that I can still maintain separation of markup and
presentation was all I needed to fully embrace tailwind.


## Where to go from here

With how quickly things change in the JavaScript ecosystem I fully expect that
I will have to rewrite this website again at some point in the future, but for
the time being I am content.  Astro is all I wanted, but it is even more.
Unlike with HSSG I am not locked into one tech stack, I can pull in frontend
frameworks like React if choose so or use server-side rendering (not on GitHub
Pages of course).  It's good to have room for growth.

The content of the website is still mostly the same and it reflects in a lot of
ways me from a decade ago, not the me of today.  I will have to restructure
things and rewrite content bit by bit.  At least I now have a proper dark mode,
that's a start.



[Pelican]: https://getpelican.com/
[SICP]: https://en.wikipedia.org/wiki/Structure_and_Interpretation_of_Computer_Programs
[GNU Guile]: https://www.gnu.org/software/guile/
[cl-hssg]: https://gitlab.com/HiPhish/cl-hssg
