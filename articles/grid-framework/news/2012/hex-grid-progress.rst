:title: Hex grid progress so far
:date: 2012-09-02
:tags: old-blog, progress
:subsite: grid-framework

Here's a quick status update:

- *Drawing:* This works perfectly now, the hexes are drawn properly as
  described in the post before, and now i have added lines that connect the
  different layers of the grid.
- *Rendering:* Like drawing alsmost finished, except one minor issue. In the
  rectangular grids you can specify a width for the rendered line and, since
  the line is drawn in 2D, I had to calculate the directions in which to expand
  the lines. There were only three possible directions and the lines were
  sorted by X, Y and Z, so it was enough to calculate each of the three
  directions only once. With hex grids one set of lines is zig-zagged, so I
  need to calculate four directions total. I need to find a nice way to
  separate the the two differently slanted lines. I don't want to calculate the
  direction for every line as that would be a waste of ressources.
- *Find nearest face & Get face coordinates:* done, although only for the
  default coordinate system.
- *Find nearest box & Get box coordinates:* done, just like above


This leaves the following functions:

- *Find nearest vertex & Get vertex coordinates:* The challenge here lies in
  finding a nice coordinate system, and by nice I mean one that's intuitive to
  understand, easy to implement and easy to maintain
- *Build vertex matrix & read vertex matrix:* Getting the vertices is already
  done, the challenge again lies in finding a good coordinate system.
- *Align & Scale transform:* shouldn't pose any problems
- *World to Grid & Grid to World:* you guessed it, deciding on a coodinate
  system
- *Get Vectrosity Points:* This will take the same points as used by rendering
  and drawing, but the array has to be processed first to fit Vectrosity's
  requirements


So, all in all it looks pretty good. Unfortunately progress has been dragged
down by my studies, I'm writing exams soon, so I can't afford to work on Grid
Framework full time. The plan is to finish all the needed functionalityl for
the first release. After that additional coordinate systems will be added and
after that I'll add more drawing shapes like triangular and circular hex grids.
That will conclude the hex grid chapter of Grid Framework.
