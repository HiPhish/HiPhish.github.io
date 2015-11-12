:title: Grid Framework version 1.8.0 released
:date: 2015-03-11
:tags: old-blog
:subsite: grid-framework
:category: release

Version 1.8.0 of Grid Framework has been approved by the Asset Store team. This
release introduces a new rendering shape for hex grid: the circle. Of course,
like with polar grids, just because it's called a circle that does not mean you
are limited to just circles, you can decide on the start and end "angle" or
have a hole in the centre to create a ring.

.. figure:: {attach}./images/hex_circle.png
   :alt: Screenshot of circular hex arrangement

The shape can be drawn around any hex, not just the origin. Here is the full
changelog:

   Introducing a new rendering shape for hex grids.
   
   - *New:* Hex grids can render in a circular shape.
   - *New:* ``renderAround`` property on hex grids for the new shape.
   - *Fixed:* Size and rendering range not showing up properly in the inspector.

