title: Spherical grid coordinate systems
tags: spheric, coordinate-system
category: progress
---

Progress has been better than expected and spheric grids are practically done.
This is a good opportunity to take a look at the coordinate systems in spheric
grids.

The first application for spheric grids that came to my mind was using them
along the surface of a planet. The coordinate system used for navigation on
Earth is called the *geographic coordinate system*, a point is identified using
its altitude (distance from the planet's surface), the longitude and the
latitude.

![Geographic coordinate system schematic](geographic-coordinates.png)

The latitude is the angle between the vector and the equatorial plane, the
longitude is the angle between the vector and the plane of the prime meridian.
This coordinate system has signed coordinates: points beneath the surface have
negative altitude, the southern hemisphere has negative latitude and the
western hemisphere has negative longitude.

The other coordinate system is *spherical coordinates*. This time we use the
distance from the origin of the grid, the polar angle between the vector and
the polar axis and the azimuth angle around the prime meridian.

![Spherical coordinate system schematic](spherical-coordinates.png)

This coordinate system has no negative coordinates: the polar angle at the
equator is `π/2` (90°) and moving south increases the angle up to `π` (180°) at
the south pole, the azimuth angle works like polar coordinates and wraps around
after a full circle.

There is also the *grid coordinate system*, it is the same as spherical except
that coordinates are given in relative grid lines rather than absolute distance
and angles.


Update coming soon
------------------

So far everything looks in order, I plan on submitting the update this week if
everything goes well. I still have some more testing to run before I can
declare it production ready, then it's up the Asset Store team. Spheric grids
have been on the to-do list since the very start, so seeing them finally make
it into Grid Framework is a big step for me and I am looking forward to seeing
them in your games.
