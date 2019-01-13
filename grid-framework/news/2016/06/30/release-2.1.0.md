title: Grid Framework version 2.1.0 released
category: release
---

Grid Framework version 2.1.0 has been approved by the Asset Store. This release
brings  new  features  in making  some  previously  read-only  properties  also
writeable, fixes compiler issues in connection with Playmaker actions and makes
the code comply with the Visual Studio compiler.

The  newly writeable  properties are computed  properties  which depend  on one
stored property. When writing to the property the inverse of reading formula is
applied. These properties are:

- In hexagonal grids `Width`, `Height`, `Side`
- In polar grids: `Radians`, `Degrees`
- In spherical grids: `Polar`, `PolarDeg`, `Azimuth`, `AzimuthDeg`

The properties of the hexagonal grid are particularly useful,  because half the
`Height` is the radius of the inscribed circle. Previously if you wanted to set
the size  of a  hexagon based  on the  inner radius  in the  editor you  had to
compute the outer one by hand, but now you can just set the `Height` directly.
