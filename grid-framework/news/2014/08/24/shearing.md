title: Shearing
tags: old-blog
category: progress
---

As I mentioned last time the upcoming release will be a maintenance release
with some much-needed cleanup. While I'm still waiting for approval I have been
working on a new feature for rectangular grids that I had wanted to do for
quite a while now, but couldn't until the cleanup: I'm talking about shearing.

![Screenshot of sheared grid](shearing.png)

This is an un-rotated rectangular grid with skewed axes to create the popular
2:1 isometric look. This is quite powerful, because it allows for isometric 2D
graphics to be used with Grid Framework. Getting an isometric look in a 3D game
is very simple, you just rotate the camera until it looks right. However, in a
2D game the camera has to be perpendicular to the image plane and objects are
just drawn as if they were at an angle, so rotation is out of question.

Shearing is fully implemented, I just need to write the documentation for it.
It works with arbitrary numbers and for all axes along any other axis, so you
can shear your grids any way you want. It will be a feature for the 1.5 update
once the upcoming 1.4.2 release gets approved.
