:title: Version 1.1.7 released
:date: 2012-10-05
:tags: old-blog
:subsite: grid-framework
:category: release

Version 1.1.7 has been approved by the Asset Store team. I fixed a small typo
that prevented the menu item for adding the GFGridRenderCamera component from
working and I added two more examples,  video tutorials will follow soon. I
also redid the screenshots because the Asset Store ate my old ones somehow.

The first example shows you how you can use a plain text file and Grid
Framework to build levels outside the editor. If you have a game like breakout
that's heavily based around grid-based design it would be tedious to design
each level via Drag&Drop in the editor. Another disadvantage is that changing
the level would mean switching the scene and it would be harder for players to
create their own levels as mods. In my example we design the level as a plain
text file where each character corresponds to one predefined prefab. Then we
need to set up only one scene and the text parser script will, along with the
grid, take the text file, read it and then place blocks accordingly. You can
even switch levels on the fly without changing the scene.

The second example continues the grid-based movement example by placing
obstacles on the grid. One way to avoid them would be to attach colliders to
the obstacles and then have the walker perform a line cast in the direction of
its movement and see if the line cast hits anything. However, since this is
Grid Framework we can do better than that. In this example I create a matrix
that stores whether a tile is forbidden or not and then the walker checks if
its next target square is alowed or not. There are no colliders or physics
used.

