:title: Grid Framework version 1.2.5 released
:date: 2013-05-17
:tags: old-blog
:subsite: grid-framework
:category: release

This release serves as a preparation for Version 1.3.0, which will add polar
grids

- The methods NearestVertex/Face/BoxW and NearestVertex/Face/BoxG replace
  FindNearestVertex/Face/Box and GetVertex/Face/BoxCoordinates respectively.
  This is just a change in name, as the old nomencalture was confusing and
  makes no sense for grids with multiple coordinate systems, but the syntax
  stays the same. The old methods will throw compiler warnings but will still
  work fine. You can run a Search&Replace through your scripts to get rid of
  them.
- The GFBoolVector3 class can now be instantiated via GFBoolVector3.True and
  GFBoolVector3.False to create an all-true or all-false vector
- Similarly you use GFColorVector3.RGB, GFColorVector3.CMY and
  GFColorVector3.BGW for half-transparent standard colour vectors

I apologize for the inconvenience of having to rename the methods, but I'll try
to explain my reasoning. When Grid Framework was originally conceived only
rectangular grids were in place. For rectangular grids only one coordinate
system really makes sense, so there were two spaces: world space and grid
space. Consequently, every point could only exist in either of those two.

One of the most basic needs I implemented back then was to find the nearest
vertex of a point, hence the name FindNearestVertex, and later the same for
faces and boxes. I also needed a similar method for grid space, I wanted to get
the point's grid coordinates.

The problem arises when you start having more than just one grid space. When I
wrote hex grids I always considered the possibility of having a second
coordinate system aside from the herringbone pattern, and that's when I should
have realized that my naming convention was... well, stupid. Polar grids will
have two coordinate systems from the start, so I had the choice to either use
some band-aid solution and have a naming convention that makes even less sense,
or I could make a clean cut here and now.

So, what does this mean for you? At the moment nothing aside from a bunch of
compiler warnings. You can just ignore them if you want, the old methods are
still in place, they just call the new ones instead. I don't have any intention
of removing them anytime soon, so you don't need to rush ahead and replace your
old calls. The syntax has stayed the same, so running a quick Search&Replace
will fix things for good.

The new naming convention goes as follows (without the brackets):
Nearest[Vertex/Face/Box][X], where X stands for the coordinate system in
question. For world it's W, for grid it's G and for the upcoming polar
coordinates it will be P. Obviously only W and G make sense for all grids, the
rest depends on the specific type of grid. You will be able to convert a point
from any system into another (like PolarToWord).

I am sincerely sorry for this, but please understand that this was a necessary
step in order for Grid Framework to remain clean. I always find things to
improve and tweak, but most of them are under the hood and go by unmentioned,
it just happened that this one was on the surface.

