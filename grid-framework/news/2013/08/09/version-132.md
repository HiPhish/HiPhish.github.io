title: Grid Framework version 1.3.2 released
tags: old-blog
category: release
---

Version 1.3.2 of Grid Framework has been approved by the Asset Store Team. The
biggest news is the  addition of new coordinate systems for hexagonal grids.
You have cubic coordinates, rhombic coordinates and the old odd herringbone
coordinates now. Even herringbone and barycentric coordinates will be added at
some point in the future for the sake of completion, but they are no priority.

The documentation received a complete overhaul. Rather than two manually typed
PDFs you now have one automatically generated Doxygen documentation in HTML
format. Previously you accessed it by double-clicking the PDF in your project
view, not you can just go to Unity's help menu and the documentation will open
up in your browser.

The user manual and scripting API are now together again. The top- and sidebar
of the HTML can be used to quickly find what you want. There is also a new
section called Legacy Support that contains information on changed or dropped
features and how to restore them or upgrade your code. The changelog has also
been added to the manual, thanks to Markdown you now have both a nicely
formatted HTML and a well readable plain text file.

There are also two new examples. The first example constructs a SimCity-like
terrain mesh from a plain text file containing the heights as integers and
allows you raise and lower vertices by clicking them. Just set up your grid,
insert your height file and click play.

The other example uses polar grids to simulate a rotary dial, as found on old
telephones. Click a number and the dial will rotate that much, print a message
and then rotate back. This example can be used for circular GUIs, menus, clocks
or anything else that needs to rotate around angles.

There is also the usual bug-fixing, vertex matrix methods got cut and the
NearestFace/BoxG methods of rectangular grids have changed somewhat. You can
find the exact details in the Legacy Support section of the documentation. Here
is the full changelog:

- Hex Grids: new coordinate systems, see the manual page about @ref hex_grid
  for more information.
- New HTML documentation generated with Doxygen replaces the old one.
- Fixed a bug in `Angle2Rotation` when the grid's rotation was not a multiple
	of 90°.
- *New example:* generate a terrain mesh similar to old games like SimCity from
  a plain text file and have it align to a grid.
- *New example:* a rotary phone dial that rotates depending on which number was
  clicked and reports that number back. A great template for disc-shaped GUIs.

Some existing methods have changed in this release, please consult the @ref
legacy_support page of the user manual.

- Rect Grids: changed the way `NearestBoxG` works, now there is no offset
  anymore, it returns the actual grid coordinates of the box. Just add `0.5 *
  Vector.one` to the result in your old methods.
- Rect Grids: changed the way `NearestFaceG` works, just like above. Add
  `0.5 * Vector3.one - 0.5 * i` to the result in your old methods (where
  `i` is the index of the plane you used).
- Hex grids: Just like above, nearest vertices of hex grids return their true
  coordinates for whatever coordinate system you choose.

I am sorry for these changes so late , but I realize this differentiation made
things more complicated in the end than they should have been. It's better to
have one unified coordinate system instead. Read the @ref legacy_support to
learn how to get the old behaviour back.
