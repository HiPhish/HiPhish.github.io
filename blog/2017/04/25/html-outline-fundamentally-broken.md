title: Outlining of HTML pages is fundamentally broken
tags: html, rant, outline
---

If you were to run the Workshop through an HTML validator you would notice a
lot of warnings about the document outline. What is going on here? HTML 5
defines an [outline algorithm] which allows browsers and assistive
technologies to create an outline of the page. In theory a blind person could
ask their reader for the outline of the page and get a sort of table of
contents which they could use to quickly jump to a specific part of the page.

The problem is the “in theory” part. The outline algorithm has not been
implemented in any of the common browsers and it probably [never will be].
Instead authors are supposed to use the rank of headings `<h1>` through `<h6>`
to convey the outline of the document, which is a fundamentally broken concept.


## HTML does not know what it wants to be

HTML was originally an application of [SGML], it was meant to mark up
documents.  As such the concept of `<h1>` through `<h6>` made sense. The
contents of the document would be inside the `<body>` and would flow in a
one-dimensional way from top to bottom.

~~~html
<body>
  <h1>About Grid Framework</h1>
  Lorem ipsum...

  <h2>Advantages of Grid Framework</h2>

  <h3>Advantages over other solutions</h3>
  Lorem ipsum...

  <h3>Advantages over self-made solutions</h3>
  Lorem ipsum...

  <h2>Features of Grid Framework</h2>
  Lorem ipsum...
</body>
~~~

The number of ranks was hard-coded, but six is enough for a document. The
headings could be used as targets to jump to, and since the document is
one-dimensional there is no ambiguity as to what belongs under which heading.

Of course a product website that looks like it was written in a word processor
does not look appealing, so people began stretching HTML beyond what it was
meant to be. If you look at the source code of the Workshop you will see that
everything is built in a tree-like fashion. You have sections within sections,
multiple navigation items, and two-dimensional layout (some sites even have
three-dimensional layout with popup elements).


## HTML sectioning tags solve the problem

Prior to HTML 5 this lead to `<div>`-itis, where the page was littered with
`<div>` elements with no semantic meaning. This is bad, HTML is supposed to be
all about the content, not the layout. HTML 5 added semantic sectioning, which
solved the problem: the one-dimensional structure was abandoned in favour of a
tree-based structure. Authors can still write classic one-dimensional
documents, but they can also structure the page in terms of sections where
sections can contain any number of sub-sections:

~~~html
<body>
  <header>
    <img src="logo.svg"/>
    <nav>
      ...
    </nav>
  <header>
  <section>
    <header>...</header>
    <main>
      ...
    </main>
    <nav>
      ...
    </nav>
    <aside>
      ...
    </aside>
  </section>
  <footer>
    ...
  </footer>
</body>
~~~

What about the outline though? Now I know that there is some page element for
navigation, but which kind of navigation is it? This information is conveyed by
the old heading elements. Simple enough, just add a `<h1>` as the first child
of the section and you are good to go. At least that is how it is supposed to
work in theory.


## The problem with hard-coded heading ranks

Ideally the rank of the heading does not matter to the outline algorithm. We
could use a `<h1>` for every section and the algorithm would count the section
instead of looking at the rank. Unfortunately this is not implemented in any of
the major browsers and the `<h1>` is treated as a page-wide top-level heading.
In other words, the nesting of our sections is lost and the outline is
completely flat.

If you look at the simple example above you will notice that the `<main>` is a
rank three element, so its proper heading would need to be `<h3>`. This leaves
only three more ranks of headings for the contents of the `<main>`. We are
still using the old one-dimensional outline method for multi-dimensional
content.

### Lack of heading ranks

The code snippet I provided was a very simple example, in reality nesting can
go even deeper. Take the Grid Framework news blog: the list of articles has
rank four, and every article preview has rank five. If there is a heading in
the article preview itself that‘s already at rank six, the lowest rank possible
in HTML. One might argue that I should not have built so many ranks in the
first place, but I disagree; the top level (1) is the common structure for the
entire site, the next level (2) is the Grid Framework sub-site, followed by the
blog structure (3), which contains the list of articles (4). This is all
logical nesting based on the hierarchy of the page within the site.

### Hard-coded headings break `<article>`

The problem becomes even more glaring when you consider that an `<article>`
element is supposed to be an element that can stand on its own without the
surrounding content, such as a blog post, a comment or a product card. If the
article cannot have a rank one heading, then it can never stand on its own.

### Automation concerns

This is also a problem with automatic generation of pages. Take this post as an
example: while writing it I should not have to concern myself with the question
of what ranks the headings will have to have in the surrounding page. In fact,
I cannot do that, because after changing the template or uploading the post to
another service or running it through a converter the surrounding ranks could
be completely different, or the concept of surrounding ranks might not even be
applicable. Furthermore, what if I run out of ranks? This article already has
three ranks of titles, now imagine If I wanted to publish actual in-depth
documents.


## How could the problem be solved?

The [last comment] in the [above linked] article describes a good solution: use
the nesting of a section for the global rank and use `<h1>` through `<h6>` for
local ranks within that section. Every section would begin with a `<h1>` and
could contain lesser ranks, but the effective rank of each heading would be the
sum of the section‘s rank and the rank of the heading. This way it would be
possible to structure pages multi-dimensionally, but still use a
one-dimensional structure *inside* a section.

Taking this blog post as an example again, my generator would use the headings
`<h1>` through `<h6>` and the browser would figure out the true rank of a
heading based on how deep the post is actually nested inside the page.
Furthermore, since this post is an `<article>` it could be cropped out of the
page and still make sense on its own.

So what should I do with the Workshop in the meantime? Nothing. I‘m sorry, but
the current one-dimensional ranking system simply cannot be made to work with
this design. In order to make it work I would have to throw away most of the
tree-based design in favour of a flat design with barely no structure. The cost
does no outweigh the benefits. Browser manufacturers need to get their houses
in order, it cannot be that we have WebAssembly and WebGL shaders in our
browsers, but no way of generating an outline for blind people. This is really
telling about where their priorities lie.

And before anyone decides to call me unprofessional for this attitude, try
outlining the websites of some of the larger companies who hire professional
web designers to work on their sites and see what the result looks like.


[outline algorithm]: https://www.w3.org/TR/html5/sections.html#outline
[never will be]: http://html5doctor.com/computer-says-no-to-html5-document-outline/
[SGML]: https://en.wikipedia.org/wiki/Standard_Generalized_Markup_Language
[above linked]: http://html5doctor.com/computer-says-no-to-html5-document-outline/
[last comment]: http://html5doctor.com/computer-says-no-to-html5-document-outline/#comment-2130593
