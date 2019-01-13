title: Keeping the renderers updated and efficient
category: progress
---

Rendering a grid is a three-step process: first we count how many lines we need
to render and  allocate the space needed,  then we compute their end points and
finally we send them to Unity to do its thing. In the earliest versions of Grid
Framework these three  steps had been done every frame.  Since arrays in C# are
heap objects this would send the garbage  collector in overdrive for very large
grids.

An optimisation  was put in  place very quickly:  if the  grid has  not changed
simply re-use  the existing points.  If the points have changed,  but not their
amount re-use the array and only overwrite the values in it.  This could be the
case for example when  you change the spacing of a rectangular grid,  the lines
change, but their amount stays the same.

Since back then  there were no  separate renderer classes  everything was  done
inside the grid class and I had full control over everything going on,  but now
we need some way for the renderer object to know when the grid has changed. The
obvious solution would be  to keep a local copy of every public property of the
grid in the renderer and compare the copy to the original every frame:

~~~cs
// private variables in the renderer
var spacing  = Grid.Spacing;
var shearing = Grid.Shearing;

bool GridHasChanged() {
    return spacing != Grid.Spacing || shearing != Grid.Shearing;
}
~~~

This is pretty simple,  but it wastes memory by keeping basically a second copy
of the grid and we would still have to run the method every frame. There has to
be a better solution in which  the renderer does not not have to poll the grid,
but the renderer gets notified by the grid instead.


Subscribing to grid events
--------------------------

C# offers such a feature  with events and delegates.  We define an event in the
grid class and fire  it from the grid.  The renderer can subscribe to the event
by setting a method to run when the grid fires the event.  This distributes the
work  neatly  between  grid  and  renderer:  the  grid  does not  know who  has
subscribed  to it  and  is only  concerned  with  firing the  event,  while the
renderer takes on the responsibility of performing the actual action.

The  renderer  subscribes  when  it  is  enabled  and  unsubscribes when  it is
disabled.  The syntax is a bit odd:  the grid exposes  an event type and we add
the delegates of  the method to call to it using the `+=` operator.  A delegate
is  a  method  reference,  similar to  a function  pointer in  the C-family  of
languages.

~~~cs
// The arguments of the event are encapsulated in their own type
using SpacingEventArgs = GridFramework.Grids.RectGrid.SpacingEventArgs;

// Subscribe when the renderer gets enabled
void OnEnable() {
    Grid.SpacingChanged += OnSpacingChanged;
}

// Unsubscribe when the renderer gets disabled
void OnDisable() {
    Grid.SpacingChanged -= OnSpacingChanged;
}

// The action to perform
private void OnSpacingChanged(object source, SpacingEventArgs args) {
    // Code goes here...
}
~~~

These facilities are public and available to users as well if they want to
subscribe.

Using events for everything would be overkill though, for changes to the
renderer itself we still use regular private methods inside the renderer class:

~~~cs
// Public accessor for member variable
public Vector3 From {
    get {
        return _from;
    } set {
        var previous = _from;
        _from = Vector3.Min(value, To);
        OnFromChanged(previous);
    }
}

private void OnFromChanged(Vector3 previous) {
    // Code goes here...
}
~~~

We  cannot  subscribe  to these  changes,  nor should  we.  The changes  to the
renderer  affect only  the points  computed,  it's a  black box  where you  get
coordinates out and nothing more.


OK, we know the grid has changed, what now?
-------------------------------------------

Knowing that something has changed is the first step, the next one is to decide
what to do with that knowledge. The easiest solution is to just re-count and
re-compute everything. If the amount of lines has not changed we don't need to
allocate a new array, but other than that we don't save any work.

~~~cs
int numberOfLines;

Vector3[][] lines;

if (lines.Length != numberOfLines) {
    // allocate a new array
}
~~~

We could instead use the knowledge of *what* has  changed to make very specific
adjustments which  might perform  better.  If we  take rectangular  grids as an
example again,  a change in spacing can be replicated by multiplying all points
with a number of matrices.  Profiling the two  possibilities has shown that the
more complicated  approach performs  about  twice as well  on a 100 × 100 × 100
grid.  The extra effort  is not always worth it though,  and if you are writing
your own renderers  you should profile  the performance  of the  naive approach
first.


It's not that simple though
---------------------------

Ideally this would be it, but Unity throws a few roadblocks in my way. For one,
there is no  way to subscribe  reliably outside  of play  mode.  This means  in
editor mode we have to re-count and re-compute the points anyway.  There are no
new arrays allocated if we don't have to, so there is that.  Performance in the
editor is not  as crucial and  I haven't  noticed any impact  on the editor for
reasonably sized grids, so this shouldn't be an issue in practice.

Another roadblock  is that  there is  no way  to be  notified when  an object's
`Transform` changes. We have to do it the hard way:

~~~cs
private Vector3    _oldPosition;
private Quaternion _oldRotation;

private bool TransformHasChanged() {
    bool result = false;

    result |= _oldPosition != transform.position;
    result |= _oldRotation != transform.rotation;

    _oldPosition = transform.position;
    _oldRotation = transform.rotation;

    return result;
}
~~~

These workarounds have the same drawbacks as discussed above, but they are much
smaller now that they are reduced to just two cases.


Only work when enabled
----------------------

The final optimisation  is to not  work at al l when not necessary:  a renderer
will not perform any of  these tasks when it is disabled.  This is the simplest
of all, we unsubscribe from all events, the rendering system skips the renderer
and nothing  is drawn.  Aside from  its  memory footprint  the renderer  has no
impact on the game.  Disabling a renderer is done the same way as for any other
Unity script,  either by  unchecking the  box in  the editor  or by setting the
`enabled`  member  variable  to `false`.  This  was  not  possible  in previous
versions where the renderer and the grid were one and the same object.
