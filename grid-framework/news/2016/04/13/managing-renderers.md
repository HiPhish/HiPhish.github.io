title: Managing renderers
category: progress
---


Breaking the rendering  task out of the grid  into its own dedicated class is a
good first step, but if all we have gained from this is several smaller classes
we haven't  really gained much.  In this entry  I will discuss  how version 2.0
gives you more control over the rendering process.


Priority
--------

Setting the order in  which grids are rendered  when every grid can be rendered
only once is simple,  just let their position in the world handle it.  However,
in version 2.0 the rendering will be separated from the grid itself, so we need
proper control over the order.

Every renderer has a `Priority` property, that's an integer value which is used
to sort renderers  in a list  maintained  by the camera.  If you  have multiple
renderers per grid you will want to  have control over which ones render on top
of which ones. In version 1.x to achieve that effect you would need to create a
whole new grid and then make it match the first one.


Managing renderers
------------------

Every renderer created is  registered with a central manager class.  This class
is static so you don't have to  instantiate anything and renderers take care of
this process themselves. The entire thing works on autopilot and you don't have
to concern yourself with it if you don't want to.

However,  if you  do want  to you  can access  all the renderers  directly  and
manipulate them.  Why would you want to do that? You could for example take the
lines computed by the renderer and instead of having Grid Framework render them
you send them to your own code.  This gives you 100% control  over every single
line.


Rendering lines
---------------

As with version 1.x every camera will need a script attached to it. What is new
is how the script works: in version 1.x it was really just a small wrapper that
called the grid's rendering method.  This method has been moved into the camera
script instead. If you don't like the default implementation you can write your
own replacement now,  while in version 1.x  you would have had  to modified the
grid script instead.


One caveat: overlapping grids
-----------------------------

There is  one problem  I have  not been  able to solve:  sorting  lines back to
front.  What this means is that  if two grids are overlapping,  then lines that
are in front of other lines need to be drawn on top of them.  Implementing this
sort  of  drawing  would   be too  slow to  be useful,  so you  are better  off
generating meshes from  the lines and letting Unity handle the rest from there.
That's what Vectrosity is doing and it works very well. I'm sorry, but there is
no good  solution for  this  problem,  short of  re-inventing  what  Vectrosity
already does.  This is why Vectrosity support  will remain in version 2.0 as an
extension method to renderers.
