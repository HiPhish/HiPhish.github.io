title: Rewriting the Workshop
tags: website
category: organisation
---

At this point I  could start to make rewriting  my website an annual tradition.
There have been a number of little  details that have been rubbing me the wrong
way for almost a year now;  the biggest one was the navigation bar on sub-sites
like the  Grid Framework  product site.  There were  also accessibility  issues
relating  to  the lack  of a  proper  HTML  document  outline  and  the  use of
JavaScript.


## The sub-site navigation bar

Until now I had simply been using the same standard navigation bar that is also
on top of every page.  This worked,  but it was pretty ugly because even though
one bar was clearly subordinate both looked the same. The sub-site bar needs to
be smaller and less prominent.

The solution was to  roll my own code for  my own sub-site navigation bar.  The
bar itself is simply  a plain `<ul>`  and I am using the  CSS flexbox module to
style it. Here is what the HTML looks like:

~~~html
<nav class="sub-site-nav">
  <h1>Sub-site navigation bar</h1>

  <ul>
    <li><a href="#">Title</a></li>
    <li><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
    <li><a href="#">Item 4</a></li>
  </ul>
</nav>
~~~

That's it,  we only specify that  our `<nav>` is a  sub-site navigation bar and
let the CSS style the elements accordingly. You will also notice that the title
is part of the list as well; I will use CSS to style the title differently, but
some people prefer to  make the title a separate element from the list.  I made
it  part of  the list  because  despite the  visual  distinction it is  all one
navigation bar and the title should be counted when enumerating the list.

With the content set  in place we can start applying the style to it.  Since we
have wrapped everything  inside a `.sub-site-nav`  item we style only its child
elements.  First let's  hide the  heading,  it's  only used  for   the document
outline.

~~~css
.sub-site-nav > h1 {
   display: none;
}
~~~

Now comes the interesting part: the list.  I am using the CSS flexbox module to
style the site, it's a fairly new feature that allows us to pass specifications
in CSS on how to distribute elements and let the browser figure out the optimum
instead of computing values by hand. To this end we have to declare the list to
be a flex container

~~~css
.sub-site-nav > ul {
   display: flex;
   flex-wrap: wrap;
   justify-content: flex-end;
}
~~~

The  last property  `justify-content: flex-end`  will push all elements  to the
right while preserving their order  (non-flexbox hacks would always reverse the
order).  We are almost done,  but in order to make the  navigation look good we
have to make the title stand out from the other list items.  Since the title is
the first child of the list we can use the `first-child` pseudo-class:

~~~css
.sub-site-nav > ul > li:first-child {
   margin-right: auto;
}
~~~

This will push  the first element as  far to the left as possible.  All that is
now left is  styling the list  elements themselves  so they  look good.  I also
styled the `nav`  itself to  give it a border  line at the  bottom to stand out
from the rest of the page.  Thanks to flexbox it has been dead-simple to evenly
distribute the  items in a  few lines of  CSS instead of  heaving to  resort to
awkward helper-classes or empty `<div>` elements.


## Document outline

The  document outline  is what made  me rewrite all  the templates  almost from
scratch.  The old  outline  was  all flat,  so I  had to  introduce  sectioning
elements where I had  `<div>` elements before and  use semantic HTML where ever
possible. In order to make it possible to identify those sections I also had to
add headings  everywhere and  hide them via CSS,  as shown above.  The workshop
should now become more  accessible once more client  software starts supporting
the  outline algorithm.  Go ahead and try it out,  open this page in the [HTML5
Outliner] and see the result.

[HTML5 Outliner]: http://gsnedders.html5.org/outliner/


## A new blog navigator

The sidebar for the blogs has also been changed from the ground up. The old one
was too  bulky and  had a  fancy  "accordion"  feature:  clicking a  year would
un-collapse a list  of sub-entries.  That way  you could  click a year,  then a
month, and you would see all articles for that month right in the side bar.  It
was pretty fancy,  but not very useful and utterly unusable without JavaScript,
so I threw it out.

The new  navigator is all static:  clicking a year will take you to the archive
of that year instead.  You can  see all articles  from that year in the body of
the page,  and in the  navigator a  sub-list of  months will  appear under that
year.  Clicking a month will  take you to the archive of that month,  narrowing
the body of the page down to only those articles.

Effectively the  new navigator  has exactly  the same  features as the old one,
except it is static now. This means you will have to load a new page, but since
there is no JavaScript to execute  this will be very fast. The new navigator is
also more accessible because it only lists the relevant items instead of having
an archive of the entire blog at all times.

Finally, on small screen sizes the navigator is moved down beneath the articles
and all the lists are hidden. They would take up too much screen space, instead
the reader can  click the titles or  the archives and get taken there.  This is
accomplished using flexbox again. Here is the HTML first:

~~~html
<section class="blog-body">
   <h1>Blog</h1>

   <main>
     <section>
        All the articles go here
     </section>
   </main>
  <nav>
     <h1>Blog navigation</h1>
     <nav>
        <h1><a href="#">Archives</a></h1>
        <ul>
          ...
        </ul>
     </nav>
     <nav>
        <h1><a href="#">Categories</a></h1>
        <ul>
          ...
        </ul>
     </nav>
     <nav>
        <h1><a href="#">Tags</a></h1>
        <ul>
          ...
        </ul>
     </nav>
  </nav>
</section>
~~~


~~~css
/* The blog body contains the navigator and the articles list */
.blog-body {
   display: flex;
}

.blog-body > nav {
   order: -1;  /* Move the navigator left from the article */
}
~~~

This will put the article(s) and  the navigator horizontally next to each other
and move the  navigator visually  before the  article by  changing  the `order`
property. For smaller devices we use a media query to change the flex direction
to a colum, which will put the navigator on top of the articles.  We change the
order to move the navigator down and hide the lists.

~~~css
@media(max-width: 768px) {
   /* Re-arrange the articles and navigator vertically */
   .blog-body {
      flex-direction: column;
   }

   /* The navigator comes after the articles now. */
   .blog-body > nav {
      order: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
   }

   /* Hide the navigator lists, they are too large */
   .blog-body > nav > nav ul {
      display: none;
   }
}
~~~


## Hamburger menu without JavaScript

Every site should provide its  full functionality without requiring JavaScript.
It might  not be as pretty,  but it has to fully work.  The standard navigation
bar example from Bootstrap requires JavaScript for the toggle, but it turns out
that it can  also be accomplished without.  The following  trick comes from the
blog of [Viral Patel], so all credit goes to him.

[Viral Patel]: http://viralpatel.net/blogs/bootstrap-navbar-menu-without-javascript/

Here is the HTML:

~~~html
<nav class="navbar navbar-default">
  <div class="container">
    <input type="checkbox" id="navbar-toggle-cbox">
    <div class="navbar-header">
      <label for="navbar-toggle-cbox" class="navbar-toggle collapsed"
             data-toggle="collapse" data-target="#navbar">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </label>
      <a class="navbar-brand" href="#">Project name</a>
    </div>
    <div id="navbar" class="navbar-collapse collapse">
      <ul class="nav navbar-nav">
        <li class="active"><a href="#">Home</a></li>
        <li><a href="#about">About</a></li>
      </ul>
    </div>
  </div>
</nav>
~~~

The differences are  the existence of a new  `<input type="checkbox">`  element
and changing the  `<button>` to a `<label>`.  This by itself won't do anything,
we need a few lines of CSS as well:

~~~css
#navbar-toggle-cbox {
   display:none
}
#navbar-toggle-cbox:checked ~ .collapse {
   display: block;
}
~~~

First we  hide the checkbox  from sight,  then we  use its  state to toggle the
display of the `.collapse`.  If JavaScript is available  the new hamburger menu
will work  just like before,  but if  JavaScript is  unavailable the  collapsed
items will still pop up.  It won't be as pretty because there will be no smooth
animation, but it will be usable.

I consider this a hack because it introduces an extra HTML item, but as long as
there is no built-in  solution in HTML or CSS  every approach is more or less a
hack.
