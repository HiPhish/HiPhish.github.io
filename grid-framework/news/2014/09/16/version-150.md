title: Grid Framework version 1.5.0 released
tags: old-blog
category: release
---


Grid Framework version 1.5.0 has been approved by the Asset Store team. This
version brings a great new feature for anyone interested in making isometric 2D
games: shearing. Shearing allows you to slant a rectangular grid's axes without
having to rotate the grid. Up until now the only way to achieve the isometric
look was to rotate the grid or the camera in 3D space, but in 2D games the
camera has to be perpendicular to the image plane and thus the grid as well.
Now all you need to do is just set the shearing of the axes and you're good to
go, everything else stays the way it was.

The shearing is stored in a new type called *Vector6* that works very much like
Unity's own *Vector3*. The *Vector6* class resides in the new GridFramework.
Vectors name space to prevent name collision with other custom types or a
possible future official *Vector6* type from Unity.

The `GFBoolVector3` and `GFColorVector3` classes have also been moved to that
namespace and had their "GF" prefix stripped away. If you used them in your own
scripts strip away the prefix and place a using directive at the start of your
script, otherwise you have to do nothing.

Here is the full change log:

   Introducing shearing for rectangular grids.

   - New: Rectangular grids can now store a `shearing` field to distort them.
   - New: Custom `Vector6` class for storing the shearing.
   - API change: The odd herringbone coordinate system has been renamed to
     upwards herringbone. The corresponding methods use the `HerringU` pre- or
     suffix instead of `HerringOdd`; the old methods still work but are marked
     as depracated.
   - API change: The enumeration `GFAngleMode` has been renamed `AngleMode` and
     moved into the `GridFramework` namespace.
   - API change: The enumeration `GridPlane` has been moved into the
     `GridFramework` namespace. It is no longer part of the `GFGrid` class.
   - API change: The class `GFColorVector3` has been renamed `ColorVector3` and
     moved into the `GridFramework.Vectors` namespace.
   - API change: The class `GFBoolVector3` has been renamed `BoolVector3` and
     moved into the `GridFramework.Vectors` namespace.
   - Enhanced: Vectrosity methods without parameters can now pick between size
     and custom range automatically.
   - Fixed: Vectrosity methods were broken in previous version.
   - Updated the documentation.
