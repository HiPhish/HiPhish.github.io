title: Spheric grid rendering
:tags: spheric
:category: progress
---

I have been working on the next type of grid: spheric grids. Think latitude and
longitude like on Earth. Here is a GIF of a rendered grid rotating around its
axis. Don't worry about the framerate, that's how the image was recorded to
save space, the actual rotation is smooth as silk.

![Rotating spheric grid animation](rotating-grid.gif)

There is still backend work to be done before it can go live, but things are
looking good so far. I hope I can release it still before the end of the year.

Also, fun fact: the perspective in the image makes the direction of the axis of
rotation ambiguous. You cannot tell whether the north pole or the south pole is
closer to the camera. If you focus on it you can make your brain change the
rotation on the fly, and if you want to get really trippy you can make your
brain see the grid rotate one way and the axis-arrows the other way.
