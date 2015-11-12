:title: Introduction
:date: 2012-04-09
:tags: old-blog
:subsite: grid-framework

Hello everyone :)

I have been working on making a 2D platformer in Unity in the spirit of the old
8 Bit and 16 Bit games such as Super Mario and Sonic. One thing I really admire
about those games is their sense of clockwork-like precision, you never feel
cheated by the controls, you always know which jumps you can make and which
ones you can't.

Part of this precision comes from how these games can easily be broken up into
blocks. For example Mario is either 1x1 blocks or 1x2 blocks large (actually
it's slightly less, but let's not get lost in details here), he can jump a
certain height and certain distance at a certain given speed and the level
designers can easily calculate how many blocks they need to use to make the
game just challenging enough to be fun but not unfair.

Consequently, I would have to do the same thing. I would need to come up with a
certain block size (let's say 1x1 in Unity units) and adjust the scale and
position of everything accordingly by hand. Not fun at all. Wouldn't it be
awesome if Unity had some sort of grid framework, some way of specifying the
grid's spacing and origin and just have the computer do the rest? Couldn't the
computer scale and position my blocks inside the grid instead of me?

Well, if you need it, then make it, that's what I told myself. After coming up
with an approach and a long-term plan of what to do I made the first step, a 2D
grid class that can be used for scaling and alignment. The script will match
you objects as closely to the grid as possible, so if your block is slightly
larger it will shrink and if it's slightly smaller it will grow. With just a
single key combo you can turn this messy Breakout field

into this clean arrangement

.. figure:: {attach}./images/Breakout.png
   :alt: some image

Actually, it took me longer to put those blocks into the scene than to align
and scale them. As you can see some blocks didn't even have the right
proportions.

.. figure:: {attach}./images/Breakout2.png
   :alt: some image

Of course aligning and scaling is not all this is good for. As I mentioned
before, the 2D grid is a class and as such can be used for scripting as well.
The functions for scaling and aligning are built into the class so you can
perform these actions during runtime. You could use the grid for path finding
or anything you want. Every grid contains a matrix of its vertices, allowing
you to instantly read any point within a specified range just by providing the
coordinates, no math needed. Every grid is infinite in size since it's only
defined by origin and spacing (the vertex matrix obviously isn't infinite) so
there are no limitis to how far you can go with this grid.

I'm currently doing some polishing and fixing minor bugs. A promotional YouTube
video will be coming soon, I finished writing the script, now I need to record
it. Once I'm done the assets (including the documentation with scripting
reference) will be avaible in the Unity Asset Store for an affordable price.
The future plans are to properly support 3D grids with rotation, make the
interface more convenient, have mouse snapping in the editor, hex grids and
whatever else I can come up with.
