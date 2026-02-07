---
title: Version 3 reaching feature parity with version 2
category: progress
tags: API-change, v3
---

Grid Framework version 3.0 is coming along nicely, I have reached feature
parity with the previous major release. This means that the heavy refactoring
is mostly done and I can now build upon that foundation. I want to take this
opportunity to reflect on what will change.


## The rendering system

The first two major releases of Grid Framework had a very naive idea of
rendering: there was only one primary way of rendering a grid and Vectrosity
support somehow wedged in there, but stuck out like a sore thumb. For version 3
I want to have a proper rendering system that many objects can access in a
uniform way, which will make it possible to ship with a reasonable default set
of backends and allow anyone to write their own custom rendering backend. Here
is a rough sketch of how it works:

```
 +------------+  +------------+  +---          ---+  +------------+
 | renderer 1 |  | renderer 2 |  |     ......     |  | renderer n |
 +------------+  +------------+  +---          ___+  +------------+
       |                |                                   |
       |                |                                   |
       |                |                                   |
       +----------------+------------  ......  -------------+
                           |
                           |
                           V
                  +------------------+
                  | rendering system |
                  +------------------+
```

The rendering system acts as a mediator between the renderers and other objects
which want to receive grid points. These rendering backends do not need to know
about all the renderers in the scene, renderers automatically register and
unregister themselves with the rendering system. This provides decoupling
between renderers and backends and leaves the two with only one narrow
interface between them.

Currently there is only one backend which renders the grids using Unity's
low-level `GL` class; this is the same backend we have in version 2 as well. The
next backend with be mesh-based: it will generate a mesh for each grid and let
Unity handle rendering that mesh.

### Performance considerations

The original rendering implementation had a massive memory leak problem: I was
allocating an array for every grid every on frame and throwing the old array
away.  This was not much of an issue because C# is a garbage-collected
language, but the large amount of garbage was hitting performance really badly
for large grids.

I solved the issue by introducing a caching feature in the implementation where
I store the array of points and as long as the points have not changed I can
just send out the same points again. If the points have changed, but not their
amount I can mutate the existing array instead of allocating a new one. Only if
both the points and their number have changed to I have to compute them from
scratch.  You can read more about it in this [old
post](/grid-framework/news/2013/03/30/endless-grid/).

This is good enough for the existing `GL` backend which has to redraw the grid
on every frame anyway, but it will not do for a backend which generates a mesh.
If we generate a new mesh on every frame we are right back where we started
with the garbage problem. For this reason the rendering system delivers also
needs a mechanism which indicates to the backend whether the points have
changed since the last query.


### Breaking OOP best practices

My original plan was for renderers to push changes to the rendering system and
then have the rendering system notify the backends. The system would keep track
of both the renderers and the backends and implement an observer pattern. I had
to scrap the idea though because there is no way in Unity to get notified when
the `Transform` of an object changes.

The rendering system is a static class rather than an actual object. Proper OOP
best practices shun static classes because a static class with mutable members
is really just global state in disguise. You cannot mock it and you cannot
inject it as a dependency into an object.

This is one instance where pragmatism wins over theory. Unity's `MonoBehaviour`
class does not provide me with constructors for dependency injection and there
is no god-class which could instantiate a rendering system object. It is not as
bad as it might sound though, it just means that instead of testing one class
at a time I might have to test two classes at a time, which is something I can
live with.


## Removing the event system

Speaking of pragmatism, I have decided to remove the grid event system. It was
originally put into place in order to make the renderers lazy: there are a
number of private cached member variables inside each renderer which only need
to be updated when the grid changes. Using C# events I had set up a system
where mutating a grid property would fire off the event and trigger the
renderer to compute the cached members anew.

For example, I had the following code in the `RectGrid` class (documentation
comments omitted):

```cs
public class SpacingEventArgs : System.EventArgs {
    private readonly Vector3 _difference;

    public SpacingEventArgs(Vector3 previous, Vector3 current) {
        _difference = current - previous;
    }

    public Vector3 Difference {
        get {
            return _difference;
        }
    }
}

public event System.EventHandler<SpacingEventArgs> SpacingChanged;

[SerializeField] private Vector3 _spacing  = Vector3.one;

public Vector3 Spacing {
    get {
        return _spacing;
    }
    set {
        var oldSpacing = _spacing;
        _spacing = Vector3.Max(value, Vector3.one * Mathf.Epsilon);
        if (SpacingChanged != null) {
            SpacingChanged(this, new SpacingEventArgs(oldSpacing, value));
        }
    }
}
```

Another script could then subscribe to this event:

```cs
RectGrid grid;
// Write some actual logic instead of logging a message
grid.SpacingChanged((sender, args) => Debug.Log("Spacing has changed"));
```

In the end it was not worth the effort, it just bloated up the API with new
classes. The new code simply compares the current value and the previous value
whenever a computation is issued by the renderer. If Unity classes were meant
to be used in a reactive way they would have reactive APIs.


## Next steps

The next big step is to get the rendering system to work well with multiple
backends and then to write those backends. Once everything is working and in
place I can finish the documentation and scan it for any ugly warts that might
still be out there to remove them.
