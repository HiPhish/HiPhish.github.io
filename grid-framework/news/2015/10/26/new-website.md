title: New website
tags: old-blog
category: organisation
---

Over the last few months I have been busy redesigning the website and we are
finally live now. Check it out:

[http://hiphish.github.io/grid-framework/](http://hiphish.github.io/grid-framework/)

The new website has been rewritten from scratch, but all the old links are
still valid. It is now a modern site that looks good on desktops, on tablets,
on phones and even in text mode. All content is static and the site works fine
with and without JavaScript enabled in your browser.


Showcase your work
------------------

Judging by the five-star reviews you all seem to like Grid Framework, but what
are you using it for? I want to have a showcase page on the website where I can
show off some of the games made using Grid Framework. If you want your game
featured drop me a line, include a screenshot (or give me permission to pick
one myself) and a few sentences about your game and what you used Grid
Framework for. I'm looking forward to seeing all the cool uses you came up
with.


About the new website
---------------------

The original website was made from hand-written HTML and CSS. While I like the
pure hands-on approach it became quickly apparent that that wouldn't cut it in
the long run. Take for example the navigation bar: It has to appear on every
page, it has to be the same everywhere and the currently active item has to be
highlighted. HTML has no interactive elements and no way to include snippets. I
could have used JavaScript, but then the site would break down it people don't
have JavaScript enabled.

I was looking into different solutions and settled for Pelican. Pelican is a
static site generator, meaning you write template HTML pages with placeholders
and you write your content separately. Pelican then generates the finished
website from your template, content and a number of settings. This has all the
benefits of being static while being easy to maintain.

For the actual website I decided instead of reinventing the wheel I would just
leverage the work of people who know more about web development than me. I use
Bootstrap as my CSS framework and jQuery for light JavaScript decoration. I
also now have a proper gallery using Pretty Photo library. You can find a list
of all components on the [about](http://hiphish.github.io/about/) page.

One final note about JavaScript if you are concerned about proprietary code:
all the foreign code is free software and the code I have written is free as
well (MIT licensed), no need to worry.

What is still missing is the blog. Because I intend the Workshop to be home to
all my projects it would be a bad idea to lump all news into the same blog.
Pelican has no capability of producing multiple blogs, I will have to write a
multiblog plugin instead. Until then this blog stays the news site.
