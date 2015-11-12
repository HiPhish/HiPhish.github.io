:title: Version 1.0.1
:date: 2012-08-04
:tags: old-blog
:subsite: grid-framework
:category: release

If you tried debugging the functions FindNearestFace() or FindNearestBox() you
might have noticed that the cubes drawn didn't have the same rotation as the
grid. While it didn't change anything about the returned value (only the centre
of the cube mattered), it looked ugly. I've submitted a small update that fixes
the rotation:

.. figure:: {attach}./images/rotated-cube.png
   :alt: Image of a rotated cube gizmo

The update should get approved soon.

