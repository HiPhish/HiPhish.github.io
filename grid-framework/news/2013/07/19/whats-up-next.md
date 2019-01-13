title: What's up next?
tags: old-blog, API-change
category: progress
---

Hello everyone, I decided to do a status update so you know what's going on and
coming next.


Two new examples
----------------

The first example is something I wanted to do for quite a while, it generates a
terrain mesh like the terrain in games like SimCity from a plain text file. You
provide the numbers for the height of vertices and the mesh gets created. On
top of that you can click a vertex to raise it and right-click to lower. All
the vertices will be placed along the vertices of the grid, so the level
designer doesn't have to wory about the layout of the scene.

The other example is a rotary phone dial using polar grids, it's based on a
suggestion by a customer (I always appreciate input, don't be shy ^^). You have
a rotary dial, you click it and then it rotates like a real dial, depending on
which number you clicked. It may no look very impressive on its own, but the
template could be used for all kinds of cool UI displays and menus. It works by
checking which sector of the grid was clicked and then multiplying that with
the angle of the grid and then applying the rotation over time.
Both examples are already done and will definitely be part of the next update.


New hexagonal coordinate systems
--------------------------------

This is the main feature of the upcoming update. Up until now the only
coordinate system hex grids had was the herringbone pattern. It's easy to
understand, but when writing for it you often have to differentiate between odd
and even X-coordinate, which is... stupid. The new coordinate systems don't
have that problem, but they are harder to understand, so pick your poison ;)

The first coordinate system is "rhombic", meaning the X-axis is rotated 30°
upwards. This removes the need for the even/odd cases, but now moving
south-west is actually moving west. The second coordinate system is "cubic", it
uses three axes in two dimensions. To understand it remember the game Qbert,
the game world is in 3D with cubes, but the actual graphics are in 2D and the
cubes are actually hexagons. Finally, we have barycentric coordinates for the
more mathematically inclined.

I really want this feature to be done before going after playmaker support. I
know you guys want Playmaker and I keep telling you "later", but this is more
urgent. The good news is that these coordinate systems turned out to be much
less painful to implement than I originally expected. I still need to give
everything the final polish and make sure the systems are not only
mathematically correct, but also make sense to a human being, so I'm about 90%
done.


New documentation with doxygen
------------------------------

Up until now I have been writing the documentation in Pages and exporting it as
PDF. It was an OK workflow and the results looked reasonably well, but as Grid
Framework's API grew it became more and more of a pain to write the actual
documentation with all the cross-references and unified layout and styles. I
have now reached the point where it would be just madness to continue, so I
decided to switch to Doxygen. When you use Doxygen you comment your source code
in a specific manner, then Doxygen parses it and uses your comments to document
all the methods for a human to read.

The transition phase is ugly, I need to copy-paste or rewrite all my
documentation, but once it's done any future updates will be much easier. This
also means you will get documentation in both HTML and PDF format from now on.


Vertex matrix gets the axe
--------------------------

Finally, some not-so-good news. I have been thinking about this for a while,
and the vertex matrix methods were never really good. The idea was to give you
a quick and simple way to store some vertices of a grid in an array and be able
to read them, but the way I did it is way too specific. It will only be useful
in a handful of cases. This leaves me with two options: either expand on it,
writing many variants of the method and on top of that doing the same thing for
faces, boxes and edges, or just cut it out.

I decided to cut it out, because there is no point in dragging all that code
along, when most people will never use it and some will only use a fraction of
it. It would be much easier and better if the users themselves wrote their own
methods, it's less than ten lines of code anyway and you get full control over
what you want. You don't have to drag along an array that's four times larger
than you need. When looking at the examples I wrote, not even I used the vertex
matrix methods once, because it was easier and cleaner just to roll it from
scratch.

Naturally this raises another concern, what about the people who were using
this method? I can't just rip it out and tell them to write it themselves. This
is where extension methods come into play: After I removed the methods I put
them back into and extension method in a separate file, which I ZIPed. If you
need the vertex matrix methods back just unzip it and you won't notice any
difference. Of course if enough people actually want the vertex matrix to stay
in place I'll put it back, but if no one objects this will be the way to go.
