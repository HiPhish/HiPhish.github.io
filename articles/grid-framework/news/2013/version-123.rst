:title: Grid Framework version 1.2.3 released
:date: 2013-02-28
:tags: old-blog
:subsite: grid-framework
:category: release

This update brings you two new features, both were suggested by customers. The
first one is the ability to set a separate set of colours for rendering instead
of using the same colours as for drawing. Let's say you want a barely visible
grid in the game but a clearly visible grid in the editor. Until now you either
had had to have two grids or use a script to change the colours once the game
starts. Both options worked fine but required more work than needed, now you
can do it out of the box. Of course it is entirely optional, so if you don't
set anything you will be using the same colours for rendering and drawing.

The other new feature is relative size. Usually the size and the
renderFrom/renderTo vectors were interpreted as absolute world unit lengths. I
did this intentionally so the grid's size would be independent from its spacing
(or radius and depth for hex grids). Of course not everyone is concerned about
that sort of thing, some people would simply like to say "make my grid this
many blocks tall" instead of having to multiply the desired size with the
spacing. Turning on relative size now does exactly that for you. Here is a
visual example where the values are interpreted as absolute (left) and relative
(right) length:

.. figure:: {attach}./images/inspector-relative.png
   :alt: some image

