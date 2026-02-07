---
title: Grid Framework version 3.0.0 released
category: release
tags: v3
---

Grid Framework version 3.0.0 has been approved by the Asset Store. This is a
major release, it is not backwards compatible with version 2.x. Upgrading from
version 2.x or 1.x is free for existing customers. Here are the highlights of
this new major version:

- Rendering backend API allows plugging in different backends for rendering
  grids
- The old camera-based rendering is now a rendering backend
- New mesh-based rendering backends
- Separate assembly definition for Grid Framework
- No more project bloat thanks to modular design: Grid Framework is now split
  into a core and additional sidegrade packages which can be installed as needed
- Completely overhauled [Playmaker] bindings
- [Vectrosity] support and [Playmaker] bindings are available as separate
  sidegrades

An upgrade guide is provided in the user manual.


## The new rendering system

Previously there has been only one way to render a grid: by using the `GL`
class and sending primitive rendering commands to a camera object. This worked
reasonably well, but it had limitations and it would always draw lines on top
of sprites.

Version 3.0 introduces an extra layer of abstraction between a grid renderer
and the rendered output in the form of a message broker. Renderers were
introduced in version 2.0 and allowed users to render a grid in many different
shapes. In version 3.0 renderers send their result to a broker first, and the
broker then forwards the data to one or more rendering backends. A backend is
free to do anything with the data; it can draw lines to a camera using the `GL`
class, it can generate a mesh with `Lines` topology and let Unity's rendering
pipeline do the rest, it can forward the data to another framework such as
[Vectrosity], or it can just log the data to a file.

The following illustration is taken from the manual, it shows how the rendering
system acts as a central hub between renderers and backends.

```
+----------+                         
|renderer 1|-------+                 
+----------+       |                 
                   |                 
+----------+       |                            +-----------+
|renderer 2|-------+                    +-------| backend 1 |
+----------+       |     +--------+     |       +-----------+
                   +-----| System |-----+
+----------+       |     +--------+     |       +-----------+
|renderer 3|-------+                    +-------| backend 2 |
+----------+       |                            +-----------+
                   |                 
+----------+       |                 
|renderer 4|-------+                 
+----------+                         
```

A number of reasonable default backends (`GL`, mesh and Vectrosity) are already
provided and users can define their own backends using the rendering system
API.  For details please consult the manual.


## Modular design

In the past Grid Framework had been shipped as a monolithic package, which
means that all its features were included. There was no other way of providing
a complete package, but the method had a number of drawbacks:

- Assets from examples would show up among the project assets
- Activating support for 3rd party packages was cumbersome
- It included a lot of code one might never need in a project
- Providing examples for 3rd party packages was either cumbersome (Vectrosity)
  or impossible (Playmaker)

Grid Framework is now split up to be modular. This means there is one core
package (which you purchase from the Asset Store) that provides a library
containing everything you need. In addition there are now a number of
sidegrades, optional packages you can install for non-essential features. These
are:

- [Playable samples](https://gitlab.com/HiPhish/grid-framework-samples/):
  playable examples to get started
- [Grid align panel](https://gitlab.com/hiphish/grid-framework-align-panel/):
  an editor extension for aligning and scaling objects in a scene
- [Playmaker support](https://gitlab.com/hiphish/grid-framework-playmaker/):
  [Playmaker] bindings for Grid Framework let you use grids in Playmaker's
  visual scripting
- [Vectrosity backend](https://gitlab.com/hiphish/grid-framework-vectrosity/):
  a rendering backend using the popular [Vectrosity] library

These are all freely available as public Git repositories under the
[MIT license]. You can add them easily to your project using Unity's package
manager, which will track the packages.

Furthermore, this modular design allows other users to build and share their
own 3rd party sidegrades. All sidegrades, whether official or not, have access
to the same core API.


## Overhauled Playmaker bindings

The new bindings consolidate related functionality into common actions. For
example, instead of having a separate getter for each property for each grid,
there is now one general getter per grid. Similarly, coordinate conversion is
now only one action per grid with a dropdown to select the coordinate system
instead of one separate action for each combination of coordinate systems.

Now that Playmaker bindings are provided as a Unity Git package I was also able
to include playable examples.


## Separate assembly definition

Grid Framework now resides in its own C# assembly instead of the main assembly.
This makes it possible to use it as a dependency in packages.



## Going forward

With the new rendering API I have been able to solve the last rough spot I
could find. I expect that development of the core will slow down now, allowing
the sidegrades to grow and experiment freely. Since the sidegrades are not tied
to the core they can release independently and they can be forked into
experimental packages without affecting the stability of the core.

I have plans to create a new rendering backed based on [Linefy], a 3rd party
line drawing 3rd party. Before the split this would have been awkward to work
into the monolith, but not it's just another package.



[Vectrosity]: https://starscenesoftware.com/vectrosity.html
[Playmaker]: https://hutonggames.com/
[MIT license]: https://opensource.org/licenses/MIT
[Linefy]: https://polyflow.xyz/linefy.html
