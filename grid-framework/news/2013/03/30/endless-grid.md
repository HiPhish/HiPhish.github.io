title: Seemingly endless grids and performance
tags: old-blog, example
category: tips
---

I've been dealing with performance in Grid Framework recently and added a
feature that will keep the Garbage Collector from going crazy. Until now
rendering always went like this: Manager requests rendering from grid -> grid
calculates the end points of each line -> these points get passed to Unity's GL
class for rendering. Every single frame. I have introduced a caching feature
that will store all the calculated points and reuse them instead of calculating
everything all over again as long as the grid has not been modified.

This still doesn't solve the second bottleneck: rendering all these lines.
Unfortunately there just isn't anything I can do about this, the GL class needs
to have every single point one way or another. So, what if you want a very
large grid that extends way beyond your camera's view? The answer is to fake
it!

The idea is to only have the grid large enough to go beyond the camera's view
port. Once the camera tries to go off the grid change the grid's rendering
range to fit into the view port again. However, every time we change the
rendering range this causes the caching to recalculate the points (since our
old points are no longer valid), so caching doesn't do anything. The solution
here is to add a little buffer, to make the grid larger than the view port, so
we can move the camera a bit without going off the grid. Here is the video
showing it step by step:

https://www.youtube.com/watch?v=QVOrLlwZEtU

With such a small grid there is no real difference in using caching of not, but
the concept is there if you need it for larger cases. This example will work in
the current version of Grid Framework, but caching is a feature of the upcoming
version 1.2.4, which is still waiting for approval.
