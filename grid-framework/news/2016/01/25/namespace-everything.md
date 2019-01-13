title: Namespaces for everything
category: progress
---

Releasing a new major  version is a good  opportunity to  say goodbye  to older
versions of your environment.  Version 2.0 will require at  least Unity version
5.0, which will free me from the restrictions of previous versions.

One particular  restriction has  been the  lack of namespaces for  classes that
inherit  from  `MonoBehaviour`.  I don't  know anymore  which version  had that
problem,  but essentially any  sub-class of  `MonoBehaviour` had to  be in  the
global namespace and  this lead to the ugly `GF` prefix everywhere.  The prefix
has been dropped  now from all  the grid  classes and  they are  in a  properly
namespaced order.

The root namespace is `GridFramework`,  there a number of  other namespaces are
nested in it.  Grids reside in the `GridFramework.Grids` namespace, their class
names are the  same except for the  `GF` prefix.  This is what a  piece of user
code looks like without namespaces:

~~~cs
using UnityEngine;

GFRectGrid grid;
Vector3 gridPosition = grid.WorldToGrid(new Vector3(1, 2, 3));
~~~

Let's use namespaces instead:

~~~cs
using UnityEngine;
using GridFramework.Grids;

RectGrid grid;
Vector3 gridPosition = grid.WorldToGrid(new Vector3(1, 2, 3));
~~~

This may not  seem like much,  but keep in  mind that the  standalone renderers
introduce a number  of new classes  as well,  if every one  of those had the be
prefixes as well it would get very ugly very quickly.  Renderers reside  in the
`GridFramework.Renderers`  namespace  where  every  type of  grid  has its  own
sub-namespace on top of that.  So if we want to use a rhombic hex-grid renderer
we use the  `GridFramework.Renderers.Hexagonal.Rhombic` class.  Why this  extra
namespace in between?  All renderers  inherit from  a common grid-specific base
class,  e.g.  `GridFramework.Renderers.Hexagonal.Renderer`,  which in  turn all
inherit from a common base class `GridFramework.Renderers.Renderer`. This means
that in order to implement your own renderer you already have a very good basis
to build upon.

There might be more  namespaces down the line,  but they won't be as important.
If you are concerned that  declarations might get  too large use the C# `using`
directive:

~~~cs
using Renderer = GridFramework.Renderers.Hexagonal.Renderer;

public class MyHexRenderer : Renderer {
    // ...
}
~~~

And finally,  when everything is nicely  tucked away in different namespaces it
is much easier to find what you are looking for in the documentation.
