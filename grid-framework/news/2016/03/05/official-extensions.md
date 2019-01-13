title: Official extension methods
category: progress
---


If you have been  following my updates  in regards to version 2.0 you will have
noticed that  one of the themes  has been slimming  down the API.  Some things,
such as the `renderGrid` flag are easy to replace  with something  more general
or trivial to  replicate with one or  two lines of code.  Other methods however
are non-trivial to implement,  useful to have and general enough to included in
the framework.

This is where  extension methods come in.  Extension methods are a C# syntactic
sugar  feature that  allows us  to write new methods  that can be treated as if
they were instance methods of another class

~~~cs
// Define the extension method
public static int GetTwice(this MyClass instance, int once) {
    return 2 * once;
}

// Use the method
MyClass myInstance;
int four = myInstance.GetTwice(2);
~~~

Extensions will be used for all the methods that are useful to have,  but don't
rally belong  into the class itself.  Extensions reside  in their own namespace
and need  to be  explicitly  imported  using  a `using` statement.  Here is  a
practical example:

~~~cs
using GridFramework.Grids;
using GridFramework.Extensions.Nearest;

RectGrid grid;
Vector3 vertex = grid.NearestVertex(Vector3.one,
                                    RectGrid.CoordinateSystem.Grid);
~~~

While I was at it I also dropped the `W` and `G` suffixes,  instead you have to
pass a  coordinate  system as  an argument.  If you  don't want  to  specify an
argument every time you can write an extension method of your own.

~~~cs
using GridFramework.Grids;
using GridFramework.Extensions.Nearest;

public static NearestVertex(this RectGrid grid, Vector3 position) {
    var system = RectGrid.CoordinateSystem.Grid;
    return grid.NearestVertex(grid, system);
}
~~~

Extension methods allow me to group methods by their problem domain rather than
the class they belong to.  Namespacing them also means t hey won't clutter your
completion suggestions unless you import them explicitly.

For  now  the  methods  for alignment,  scaling,  finding  nearest  points  and
Vectrosity support will be made into official extension methods.  This will cut
down the size of  the grid classes  massively down: grids will only store their
instance methods,  relevant enumerations,  accessors and  coordinate conversion
methods.  In the  future new  extension  methods  can be  added with  their own
namespace if the need arises.
