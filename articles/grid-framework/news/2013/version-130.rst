:title: Grid Framework version 1.3.0 released
:date: 2013-06-17
:tags: old-blog
:subsite: grid-framework
:category: release

Grid Framework version 1.3.0 has been approved by the Asset Store team. The
biggest features of this release is the addition of polar grids. Check out the
updated included examples to see them right in action. Notice how in the
lights-out example the coordinates wrap around, maning that once you've
exceeded the maximum angle it start from the beginning again without you having
to worry about anything.

Even if you prefer the good old rectangular- and hex grids you'll want to take
a look at the updated API: You can now get the direction vectors for up,
forwarad and right or north, north-east, east, south-east and so on just by
calling one command. This will make grid-based movement much easier, since you
don't have to convert back and forth between grid- and world space anymore.

On top of that the lights-out and the runtime snapping example showcase how to
dynamially generate meshes from grids. The tiles of the polar lights game are
all individual meshes that fit exactly inside the idividual faces. When the
game starts the attached script runs a loop that runs through the grid and
creates the needed vertices and triangles and then assigns the proper
materials.

Here is the full changelog:


- added up, right and forward members to rectangular grids
- added sides, width and height members to hex grids
- added the enum GFAngleMode {radians, degree} to specify an angle type;
  currently only used in methods of polar grids
- added the enum HexDirection for cardinal directions (north, north-east, east,
  ...) in hex grids
- added the GetDirection method to hex grids to convert a cardinal direction to
  a world space direction vector
- hex grids and polar grids now both inherit from GFLayeredGrid, which in
  return inherits from GFGrid
- the Lights Off example now features a polar grid as well
- procedural mesh generation for grid faces in the Lights Off example
- mouse handling in runtime snapping example changed because it was confusing a
  lot of users who just copy-pasted the code

Please note that this version officially requires Unity 4, since that is what I
was building with, but there is no new API used and the scripts will run just
fine in Unity 3.

