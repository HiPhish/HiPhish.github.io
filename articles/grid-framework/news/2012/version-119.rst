:title: Grid Framework version 1.1.9 released
:date: 2012-11-19
:tags: old-blog
:subsite: grid-framework
:category: release

Surprise update! Version 1.1.9 just got approved and it contains quite a few
changes:

- NEW METHOD AlignVector3: lets you align a single point represented as a
  Vector3 instead of a Transform to a grid
- added the ability to lock a certain axis when calling AlignTransform and
  AlignVector3
- added a new constructor to both GFBoolVector3 and GFColorVector3 that lets
  you pass one parameter that gets applied to all components
- you can now lock axes in the Grid Align Panel as well
- aligning objects via the Grid Align Panel which already are in place won't do
  anything, meaning they won't create redundant Undo entries anymore
- fixed an issue in GetVectrosityPointsSeperate
- renamed the classes BoolVector3 and ColorVector3 to GFBoolVector3 and
  GFColorVector3 to avoid name collision
- size has always been a member of GFGrid, not GFRectGrid, I fixed that mistake
  in the documentation
- minor clode cleanup and removing redundant code

The first two are based on a user's suggestions, thank you for bringing those
up. Previously when you wanted to align a Transform it would be aligned along
all the axes, but now you can set certain axes to be left as they are (relative
to the grid's local space). Also, instead of aligning a Transform you can also
just align a Vector3 now, this is useful when you only need to calculate a
position. You need to specify a scale, which was previously taken straight from
the Transform, but I've set it to default to (1, 1, 1) so in most cases you
won't have to think about it. Of course the Grid Align Panel lets you lock axes
as well now. Since the option is passed as a GFBoolVector3 I added a new
convenient constructor to the class that takes only one parameter and sets all
entries to that. The same goes for GFColorVector3.

Another improvement is that objects which are already in place in the editor
will be ignored by the Grid Align Panel when you try to align them. The reason
for this is that before, if you had set the Autosnapping flag and clicked on an
object that was already in place it would create an Undo entry even though you
didn't see anything happening. Now there will be an Undo only if something
happened.

The function GetVectorsityPointSeperate had been broken due to a few typos
since release and I've only noticed it a few days ago. I guess no one was using
it yet, so it went unnoticed for quite a while. It definitely works now.

The rest is just some under the hoods maintenance, moving code around, removing
redundant parts, updating the documentation, the usual stuff. None of it has
any impact on stability or performance, but it is important to keep things
clean when I finally release the Hex Grids.

That's it for now, please enjoy the new features.

HiPhish

