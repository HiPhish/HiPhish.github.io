:title: How about herring for lunch?
:date: 2012-11-27
:tags: old-blog, progress
:subsite: grid-framework

Another progress update: WorldToGrid and GridToWorld are now implemented. For
those who don't know, those two functions convert a point's coordinates from
world space to grid space, the coordinate system used to locate points relative
to the grid's properties, and back. For rectangular grids it's a fairly simple
idea, the grid can be represented as a standard Cartesian coordinate system.
With hex grids that won't do it, you simply cannot force a hex grid into a
cartesian coordinate system, you need to find something else. Fortunately there
are several topologically identical possibilties whith easier, more intuitive
coordinate systems. For the first release I have decided to use the herringbone
pattern:

.. figure:: {attach}./images/herring.png
   :alt: some image

The vertices of this pattern are the faces of the hex grid. This means the
central face has coordinates (0, 0, Z) and the face north-east of it has the
coordinates (1, 0, Z). This way each single point of the hex grid can be
canonically identified by its coordinates. "Canonically" means that no two
points have the same coordinates and no two coordinates represent the same
point. As a side effect this gives me an all new grid to work with, although
the herringbone grid will have to wait until later before it gets the proper
treatment.

This brings me almost concludes the hex grid development. The only things left
now are the vertex matrix methods, testing and fixing everything to make sure
it's reliable and then writing the documentation.

