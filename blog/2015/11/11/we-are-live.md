title: We are live!
tags: website
category: organisation
---

The Workshop blog is finally up and running, in all its static glory. This
makes the site practically complete, at least as complete as a website can ever
be anyway. It also works great with my
[Multiblog](https://gitlab.com/HiPhish/Multiblog-Pelican)
plugin.

I wanted to be able to have more than one blog on the site. A blog can be a
place for personal ramblings about things no one else care about, but a blog
can also be the primary source of news. Mixing these two seemed like a very bad
idea to me; people might be only interested in one thing, for example Grid
Framework in my case and they don't want their time wasted with other products
and completely unrelated topics.

So here is my solution: have multiple blogs on the site. A blog consists of
articles and the interface. Blogs can share articles, and the interface is
generated accordingly. The interface is all you see around the main content:
tabs, categories, archives, period archives and so on. I could for example have
one blog for every project and one blog for all projects. People could either
subscribe to the blogs they care about or they subscribe to the aggregate blog.
Anything is possible really.

As for the blog interface itself, my main goal was in making it easy to
navigate. Originally I had intended for a "temple"-like layout, also called the
[Holy Grail](https://en.wikipedia.org/wiki/Holy_Grail_(web_design)) of web
design because finding a hack-free implementation used to be like searching for
the Holy Grail. Here is a sketch of what it looks like:


    ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃          Header         ┃
    ┣━━━┯━━━━━━━━━━━━━━━━━┯━━━┫
    ┃   │                 │   ┃
    ┃ N │     Content     │ A ┃
    ┃ a │                 │ d ┃
    ┃ v │                 │ s ┃
    ┃   │                 │   ┃
    ┃   │ <-           -> │   ┃
    ┣━━━┷━━━━━━━━━━━━━━━━━┷━━━┫
    ┃          Footer         ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

Thanks to the new flexbox features of CSS this layout is now trivial to
implement and the search is over, check out
[Solved by Flexbox](http://philipwalton.github.io/solved-by-flexbox/).

However, I decided to opt out of the right column. For one it was making the
content look too crammed in between, and the other reason is that I had no idea
what to put in there. I wouldn't use ads because you need *a lot* of clicks to
make them worthwhile and this simply is not one of those blogs where I can put
out content worth reading all the time.

The left column is used for navigation. This includes period-archives,
categories, tags and authors. I went fancy with an accordion-style tree of
articles, which sadly does not work without JavaScript. That's why the title of
every navigator menu is also a hyperlink to the corresponding archive. Since
archives are nested into archives I also added a navigation breadcrumbs menu
above the content. The finished layout looks like this:


    ┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃          Header         ┃
    ┣━━━┯━━━━━━━━━━━━━━━━━━━━━┫
    ┃   │YYYY/MM/DD/slug      ┃
    ┃ N ├─────────────────────┃
    ┃ a │       Content       ┃
    ┃ v │                     ┃
    ┃   │                     ┃
    ┃   │                     ┃
    ┃   │ <-               -> ┃
    ┣━━━┷━━━━━━━━━━━━━━━━━━━━━┫
    ┃          Footer         ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

The URL of each page is chosen so that moving one directory up in the hierarchy
will move you to the parent archive. For instance, a blog post has the URL
`website.com/blog/year/month/day/slug`. Removing the `slug` will take you to
the daily archive, removing the day takes you to the monthly archive and
removing the month takes you to the yearly archive. Removing even the year
takes you to the index of the blog. Pretty neat. If changing the URL is too
cumbersome one can also use the breadcrumbs at the top. In my case there are no
daily archives because I will rarely ever write more than one post per day.

There is no way to subscribe to a blog at the moment, but making Pelican
generate RSS feeds should be trivial. I just haven't looked into yet, I figured
it was better to release now rather than holding back just because of a feature
that does not affect the blogs themselves.

Some aspects of the blog might seem redundant, like having an *authors* archive
when there is only one author on the site. That's me "eating my own dogfood", I
am using a feature because I want to demonstrate its purpose.

Well, that's it for now, we'll see where this ride will take be from now on.
It's going to be interesting :)
