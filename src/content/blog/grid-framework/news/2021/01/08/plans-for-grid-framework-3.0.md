---
title: Plans for Grid Framework 3.0
category: progress
tags: API-change, v3
---

I intend to release a new major update which will address among other things
the grid rendering system. It has been almost five years since the release of
version 2.0, and Unity has changed quite a lot in this time. Some of those
changes, in particular the introduction of sprites, need to be accounted for in
Grid Framework.

This will be a major update which breaks backwards compatibility. Some breaks
are necessary, some will simply be me cleaning up minor bumps while I'm at it.
But all in all I expect the changes to be small, much smaller than between 1.0
and 2.0.

The upgrade will be free for existing customers since it will be basically just
a maintenance release.


## Upcoming changes

### Rendering grids

Unity is a 3D game engine, it primarily renders 3D game models. There is an
escape hatch provided by the `GL` class, but lines drawn that way appear on top
of sprites, even if the sprite is in front of the grid in the scene. This is
simply not acceptable, but this way of rendering grids has big advantage over
any alternative approach, so getting rid of it is not an option either.

Let's take a step back for a moment. C# is an object-oriented language, and the
point of object-oriented programming is interfaces and messages: the program
consists of a graph of objects which communicate among each other by sending
messages. The important part is not what class an object has, the important
part is what public interface an object exposes, which messages it can receive.
We can at runtime swap out one object for another object as long as both expose
the same interface, regardless of how they implement that interface.

Following that logic, why should there be only one way of rendering a grid? I
wish to expose a generic rendering interface and allow users to plug in their
own backend of choice. Some default implementations will be included, but users
will be able to create their own implementations as well. Here are my planned
implementations so far:

- The already existing `GL` implementation
- A new implementation which generates a mesh with `Lines` topology
- A [Vectrosity](https://starscenesoftware.com/vectrosity.html) backend, which
	will be basically the already included Vectrosity support, but rewritten

Different backends have different strengths and weaknesses. For example, Unity
renders the lines of a mesh with `Lines` topology always at the same width, and
there is nothing I can do about that, but in return you can use all the shader
features of Unity and lines will appear behind grids. For some people that
might be exactly what they need.

The main change between version 1.0 and 2.0 was breaking the huge grid classes
into small grid classes and separate render classes. This has proven to have
been a good choice and has allowed users to create their own grids very easily.
I know one customer who has created a custom grid which looks like the wires of
a guitar (the horizontal lines are not parallel and the distance between
vertical lines keeps increasing). I hope that this change will empower users
similarly.

### No more included examples

Grid Framework comes with a number of examples included to get you started.
When I had originally submitted Grid Framework to the Unity Asset Store I was
asked to provide an example or two because it wasn't really clear what my asset
was doing. Since then the number of examples and their sophistication has
grown, and Grid Framework has been established.

Bundling these examples nowadays just adds bloat to people's projects. Sure,
you can just delete them (they are all in one common directory), but then you
have to do so after each update. For 3.0 I want to move the examples to a
separate project that can be hosted in public. It would also allow people to
see the API in action before they make a purchase.

### Minimum Unity version required

I have not yet settled on a definitive version, but I will certainly increase
the requirements. This will allow me to make use of more recent C# features and
keep the code leaner.


## Time frame

I do not have any estimate on when 3.0 will be released. The changes to the
code are not large, but I have to get the API right the first time. How should
the user hook up the rendering backend to the engine? Should I allow multiple
backends at the same time? Where should newly created `GameObject`s and
components be added to the scene?

I hope to release 3.0 somewhere during the first quarter of 2021, but time will
tell.
