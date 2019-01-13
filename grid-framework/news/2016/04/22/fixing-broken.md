title: Fixing what has been broken
category: progress
---

A quick  status update,  all the  examples and  the align  panel that  had been
broken by the  API change are  working  now again.  As I had  mentioned  when I
outlined the  plans for version 2.0,  this update  will break the API.  A major
version bump is an  opportunity to throw out old cruft,  decouple what does not
belong together and streamline everything that can be made simpler.

Fixing the examples was  a good opportunity to see  just how broken the API has
become. For the most part the update was straight-forward. Here are the general
steps:

- Grid Framework  now needs  to be  explicitly imported  to every script by the
  `using` directive in C# or `import` in UnityScript.
- The `GF` prefix needs to be dropped from every class name, there is no danger
  of name conflicts anymore now that Grid Framework is namespaced.
- Some methods such as  aligning have been made into extension methods,  so one
  has to import those as well.
- Anything rendering related has been moved to the renderer classes, so we need
  a reference to  the grid's renderer as well.  In practice this means that the
  `renderFrom` and `renderTo` of the grid became `From` and `To` of the
  renderer.
- Cut out all cases  that cannot happen anymore,  such as non-relative units or
  different grid planes for layered grids.

These five steps will generally be  enough to get most use-cases working again.
There is one problem though: we have lost a lot of polymorphism, but That's not
necessarily a bad thing.

Let me explain:  when I originally  wrote Grid Framework it was only supporting
rectangular  grids,  and even those did  not have any shearing yet.  Everything
else was  just on  paper and  in my  head.  I had  imagined  grids  to be  more
polymorphic than  they really  are;  what I  mean by that  is that there really
isn't  much different  grids have  in common.  Take for  example the  rendering
range:  for a  rectangular grid  it makes perfect  sense that one  would have a
`Vector3` for the lower and upper bound. The same goes for a herringbone shaped
hex grid.  It would also make sense  for a rectangular shaped hex grid,  except
that the individual values would have  to be integers instead of floating point
numbers. At least in that case we can kind of work around the issue by rounding
to integers, but where it makes absolutely no sense is for circular shapes like
the cone hex grids, or polar and spherical grids in general.

The same  goes for  coordinate conversion.  I makes  sense the  have *the* grid
coordinate system  in a  rectangular grid,  but what  is *the*  grid coordinate
system in a hex grid?  In my case  it was  simply the  coordinate  system I had
implemented  first,  but  that  doesn't  mean  it  has  somehow  some  inherent
mathematical superiority.

Aligning and scaling objects made even less sense for non-rectangular grids. In
Unity  the  `Transform`  of  an  object  has a  scale,  which  is  a  `Vector3`
representing the scale of a cuboid. How do you fit a cuboid into a hex gird? Or
even in a rectangular grid with shearing? You don't.

Putting such tasks into  a general `Grid` class  makes no sense and no one will
use it from inside the grids that do j ust something for the sake of satisfying
the API.  Even though we have lost some  polymorphism, we have only lost it for
things that are useless anyway.

If you still think that *you* have the right solution for your specific problem
domain you can  easily add it to the grids as an extension method.  I have done
the same for the methods that have been removed from the grids as well.
