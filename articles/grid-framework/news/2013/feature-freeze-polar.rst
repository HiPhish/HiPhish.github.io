:title: Feature freeze for polar grids
:date: 2013-06-09
:tags: old-blog, progress
:subsite: grid-framework

Here is a quick update: I have reached feature freeze for polar grids, meaning
I'm done with all the features. Now I need some last polish and I must prepare
new images for the Asset Store, then it's all good to go. So, what took me so
long? Well, designing and writing code is one thing, then you have to put it to
use This often reveals weak points, some things might seems counter-intuitive,
or some things are more complicated to use than others.

One example would be making an object rotate as it moves through the grid so
it's always facing outwards. Sure, you can do it using the existing API to
convert through coordiante systems, extract the angle of the object relative to
the grid's Z-axis and then use Unity's built in math functions to create the
quaternion by rotating x degrees around the grid's Z-axis. That doesn't sound
pleasant at all. That's why now you can just call the World2Rotation method to
get the quaternion directly, then you can do whatever you want with it.

This delayed the release a bit but such small additions can make a big
difference in the end. Another thing worth noting is that this release has been
written in Unity 4 and as such it will list Unity 4 as the required version in
the Asset Store. Unity 4 has been out for half a year now, but even if you
still want to stick with Unity 3 you shouldn't have any problems as I didn't
use any Unity 4 exclusive API.

Well, that's it for now, thanks for reading.

