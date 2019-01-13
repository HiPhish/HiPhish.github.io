title: Version 1.1.6 submitted
tags: old-blog
category: release
---

**Important Note:** The classes Grid and RectGrid have been renamed to GFGrid
and GFRectGrid, you will need to change your source code accordingly.

You might be wondering why I would do such a thing more than one month after
releasing the package. Using regular English words is simple and intuitive;
however, the danger of name collision with another class called the same is
quite large. Let's say a user has already a class called Grid for something in
his or her project. When they buy Grid Framework all of the sudden they will
get compilation errors because now there are two classes called Grid. It would
be unreasonable to expect users to change their class, especially if that class
is already part of a more complex chain of dependencies or inheritance. They
could change my code, but then they would have to change it after each single
update of Grid Framework. If the class Grid is already defined in some other
third party extension it gets even worse.

Adding the GF in front of both classes reduces the chance of name collision. I
apologize to all my existing customers for having to change their source code
because I didn't think about this in time, but I had to resolve this before it
becomes an issue and the sooner I get it sorted out the less customers will
have to change their source code. I am very sorry, but this should fix the
problem once and for all.


Aside from that the GFRectGrid class contains some minor code cleanup and
performance boosts, so it's not all bad news.
