title: Revisiting coordinate systems
category: progress
---


There are  basically two types  of grid in Grid Framework: 3D grids and layered
grids.  3D grids use all three dimensions,  these are rectangular and spherical
grids,  while layered grids are 2D  grids stacked  on top of  each other  for a
third dimension.  In this  post I  will explain  how the  coordinate systems of
layered girds will change in version 2.0.


How it is in version 1.x
------------------------

Layered grids are  2D grids that are extended by a third dimension.  This extra
dimension is the *layer*. The question is how such a grid should be embedded in
the surrounding 3D space.  We could map the X- and Y-coordinates of the grid to
the X- and Y-coordinates of the 3D space and map the layer to the Z-coordinate.
Or we could use any other permutation.

For a 2D game it  makes sense if the X- and Y-coordinates of both spaces match.
But what if we want to make a top-down 3D game? It would make more sense to map
the X- and any Y-coordinates  to the world's X- and  Z-coordinates respectively
and the layer to the Y-coordinate. And this is where the problem starts.

Unit's coordinate system is left-handed,  this means that if you take your left
hand  and have the  thumb be the first axis,  the index finger the second axis,
then your middle finger is the third axis and it is pointing away from you.

~~~
Y
|   Z
|  /   A left-handed coordinate system
| /
|/
+--------X
~~~

If we use the X-axis  as the first one,  the Z-axis as  the second one  and the
Y-axis  as the  third axis our coordinate system becomes right-handed.  We have
the choice  between either  changing the  handedness or  having a  Y-axis  that
points downwards. In version 1.x I had chosen the former.

If you  can't see  the change  in handedness try  it out,  take your left hand,
point the thumb right,  the middle finger up  and your index  finger will point
towards you instead of away from you.


How it will be in version 2.0
-----------------------------

Changing handedness  really causes more problems than it supposedly solves,  so
this will be completely scrapped, every coordinate system is left-handed.  In a
top-down game  the X-axis of the grid will map to the Z-axis of the world,  the
Y-axis to the X-axis and the Z-axis to the Y-axis.

~~~
Z
|   X
|  /   Rotated 60° about the (1, 1, 1) axis
| /
|/
+--------Y
~~~

There are good mathematical reasons for this, but the important part is that if
we keep applying this transformation we cycle through the different left-handed
permutations. This can easily be implemented as a matrix transformation.

So that raises another question, if all we are doing here is rotating the grid,
why don't we  just rotate the  grid using  Unity's own capabilities?  Why do we
even have a  grid plane in  the first place? That's what I thought as well,  so
the grid plane  has been scrapped  completely for version 2.0,  you just rotate
the grid the way you like it.

Finally,  in version 1.x  I also tried  to match  the grid-coordinates with the
world coordinates,  i.e. what would  be the  Y-coordinate  in an XY-grid  would
become the  Z-coordinate in an XZ-grid.  I did this because  I thought it would
make more sense when you write your game-logic in an XZ-coordinate system,  but
that was  making  too  many assumptions  and just  made  everything  even  more
complicated.
