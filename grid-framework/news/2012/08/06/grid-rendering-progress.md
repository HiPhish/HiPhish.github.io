title: Grid rendering progress
tags: old-blog
category: progress
---

Take a look at this:

![some image](grid-rendering-progress.png)

What's so special? Look at the upper right corner, gizmos are turned off. This
is a grid rendered at runtime that would be visible in a released game. There
are still some things to care take of first: For one, the grid needs to get
rendered every frame, which is not a big deal when using the `GL` class, but a
Vectrosity-like approach where a mesh is built only once and then drawn once
until it updates would be pretty neat. Also, the GL class doesn't let you set
the width of lines, I could draw quads instead, but those are only thick if you
look directly at them, otherwise they get thinner until they become invisible
(in other words, they are flat). Lines are always the same, no matter the angle
or distance, which could be exactly what you want or not. Maybe I could include
some way for users to use Vectrosity easily if they have a license? In any
case, I need to finish this first. The code is still very messy, being in large
parts copy-pasted from the drawing code (which was kind of messy itself) and
copy-pasting code is a sure way to have your project explode right in your
face. I'll need to write a method to return a nice list of points that both
drawing and rendering can use.
