---
title: De-Bootsrapping the workshop, part 1
category: organisation
tags: html
---

The first major step in phasing out the bloat that is [Bootstrap] from my
website is done. None of the layout depends on any Bootstrap classes and
markup. Instead, the layout is built from scratch using the new Flexbox and
Grid features.

Just to clarify, I am not knocking down on Bootstrap; it predates both Grid and
Flexbox, and CSS frameworks like Bootstrap were the least painful way of
implementing more complex web page layouts. But every time you use Boostrap you
pull in bunch of crap you will never use, and the HTML markup is filled with
superfluous elements and classes which only serve the presentation, not the
content. The restrictive nature of using a fully-fledged framework leads to
websites that all looks the same (including this one), with the large
jumbotron, followed by a well with three columns, then a list of features and
stuff.

Using CSS Grid has allowed me to kick out a bunch of needless `div`s, and it
has freed the markup from the "boxes of boxes" mentality. Take for example the
blog: each page is made of the following components:

~~~
+---------+ +------------------+
|    B    | | Breadcrumbs      |
|    l    | +------------------+
|    o    |
|    g    | +------------------+
|         | |                  |
|    n    | |   Main content   |
|    a    | |                  |
|    v    | |                  |
|    i    | |                  |
|    g    | |                  |
|    a    | |                  |
|    t    | +------------------+
|    i    | 
|    o    | +------------------+
|    n    | | Pager            |
+---------+ +------------------+
~~~

The naive approach would be to see the blog navigation and everything else as
two horizontally stacked boxes. The right box would then contain three more
vertically stacked boxes. This leads to ugly code (the outer right box only
exists to contain more boxes), and it is harder to generate programmatically.

With CSS Grid I can focus purely on the content: there are four boxes, all on
the same level. The container is a grid with four grid areas, and all that is
left is to assign the areas to their individual components:

~~~css
.blog {
    display: grid;
    grid-areas:
        "navigation breadcrumbs"
        "navigation main-content"
        "navigation pager";
}

.blog > nav.breadcrumbs     { grid-area: breadcrumbs;  } 
.blog > main                { grid-area: main-content; }
.blog > nav.pager           { grid-area: pager;        }
.blog > nav.blog-navigation { grid-area: navigation;   }

@media(max-width: 768px) {
    .blog {
        grid-areas:
            "breadcrumbs"
            "main-content"
            "pager"
            "navigation";
    }
}
~~~

These few lines of code define the entire layout of a blog page. Moreover,
adjusting the layout to a different screen size is trivial, we just change the
arrangement of the grid and everything snaps back in place. Now that CSS is
handling the layout our HTML can finally be as clean as it was originally
intended to be:

~~~html
<div class="blog">
    <nav class="breadcrumbs"> ...  </nav>
    <main> ...  </main>
    <nav class="pager"> ...  </nav>
    <nav class="blog-navigation"> ...  </nav>
</div>
~~~

Clean markup is not just easier to write (and generate), it also degrades more
gracefully. I turned off the CSS out of curiosity and the result still looked
very useable.  It was quite ugly, but the order of items still made sense and
the website was functional. That way, even users of older browsers which do not
support CSS will get a usable experience instead of an exploded mess of
elements which make no sense.


[Bootstrap]: https://getbootstrap.com/
