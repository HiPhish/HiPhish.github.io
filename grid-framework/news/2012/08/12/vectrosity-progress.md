title: Vectrosity progress
tags: old-blog, example, extension
---

Well, it's pretty much done, you can now get a set of Vector3 points for use
with Vectrosity from just one line of code. I played a bit with Vectrosity to
make an example scene and this is what it looks like:

![Screenshot of laser-line grids](vectorsity-progress.png)

(yes, I am a sucker for laser lines)

The green grid just hangs there and rotates, the red grid bounces around (using
Unity's physics engine), the yellow grid resizes itself all the time and the
colourful grid changes the colours of its lines randomly. The "missing" lines
in the last grid lines are not a bug, they are sill there but coloured black.

I expect version 1.1.2 to be the last feature update before adding Hex Grids,
so I want to wrap up all the loose ends I might still have left. In particular
I want to integrate the components into Unity's main interface, no more
dragging scripts onto GameObjects.
