:title: State of the game
:date: 2012-05-14
:tags: old-blog, progress
:subsite: grid-framework

It has been over a month since I posted the introductory video and sent my
application to Unity. I never received any confirmation, so I assume it got
lost somewhere along the way...

Anyway, that doesn't mean I have been sitting here for over a month staring at
the screen and refreshing my mail. I started working on this project because I
needed a simple solution for one certain problem, that's how I started working
and over time more and more ideas came to my mind. It was clear that I would
need a complete rewrite sooner or later, so I decided to release a simple
version first and then start the rewrite instead of throwing everything up to
that point out the window.

When I sent my submission to Unity I was done with the old concept and started
working on the new, more robust concept that would allow for far more features
to be implemented cleanly. This meant switching to C# (since some things just
aren't possible in UnityScript) and diving deeper into the documentation than
ever before. I like the results. I set myself a few goals and so far I have
achieved most of them. This includes:

- grids as components instead of plain classes
- fully support 3D grids and rotation
- functions to find vertices, faces and boxes with just one line of code
- a nice panel for aligning and scaling instead of that dirty workaround
- switch between grid coordinates and world coordinates (and vice-versa) with just one line of code
- every kind of grid (quare grid, hex grid, triangular grid) inherits from one common Grid class

Most work has been done under the hood to keep the code clean. It's easy to
insert a new feature into clean code where I can leverage already existing
methods instead of having to write the same thing several times (copy-pasting
chunks of code is an awful idea!).  The one thing that still needs a good look
are the methods related to the vertex matrix, it's one of those things that are
easy to break if you aren't careful.

That said, once it's done the (hopefully now) first release would be ready to
ship. I'd also have to rewrite the entire documentation and draw new logos for
the Asset Store (in a way I'm glad my first submission got lost, those
"drawings" were just aweful)

The fist release would only cover rectangular grids with hex grids added next,
then finally triangular grids. I haven't started implementing them, but I have
already done the math and I know how to do it, I just need to finish this
first. The one last thing I can think of is grid pathfinding, but I won't even
waste a thought on that until I get the other stuff done.

