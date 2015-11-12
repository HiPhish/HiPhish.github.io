:title: The current roadblock
:date: 2012-08-23
:tags: old-blog, progress
:subsite: grid-framework

It has been over a week since my last post, so I might as well explain what's
going on. As I finished rendering I had tightened up all loose ends that were
left, I consider Grid Framework to be complete for rectangular grids. You can
perform all the common calculations, debug things and visualize the grid
properly, either using simple lines or even Vectrosity. This is just the first
step though. Hex grids are very popular for games for various reasons, so it
makes perfect sense to do them next, right? Well, here is where the problem
starts.

See, while making Grid Framework there are several challenges I need to face
(let's just ignore things like documentation or presentation for now).
Obviously I need to code the whole thing. I also need to figure out the math
for how to even do these calculations. None of those are really any big
secrets, the math has been there for centuries and the coding part is just
turning verbose instructions into C# code. It's a pretty straight-forward
process, more or less, once you figured out what to do and how to do it. And
that's where the current challenge lies.

Rectangular grids are relatively simple. Being in 3D and able to rotate and
translate and having individual spacing made them more complicated, but it was
still the same basic formulae, just more expanded. Hex grids are not as easy,
simply because there is more you can do with them. This leaves me with some
really nasty design decision.

When writing an extension I need to keep in mind that it will be used by lots
of different people who might have different ideas about what a hex grid should
work like. Some might want to fit a grid inside a rectangle, like in battle for
Wesnoth, others might want one big hexagon made of smaller hexagons, like in
Settlers of Catan. I cannot just pick one and tell the others to convert their
game to the other type. This also raises the question of coordinates. A
rectangular grid is just a standard cartesian coordinate system with some
stretching and squeezing. I can even have fractions of a coordinate to give a
precise position. If I fit a hex grid inside a rectangular grid, can I still
have fractions? Do I even want such a feature? What should the coordinates
represent, vertices or faces? What about the pointy side of a hexagon, is it
one unit or just half a unit? Speaking of which, how does everything change if
I want the tops to be pointy instead of the sides? Where should the origin lie?
How many axes should even be there? (don't laugh, once concept uses four
dimensions)

All of these questions can be answered, that is not the problem. The problem
lies in answering them all in a way that is clean to implement, clean to
maintain and clean for the end user to use. Should I make different hex grid
classes, which would be easier to code, but would mean more code to maintain
and more API for the user? I would like to just start coding and see what
happens, but these questions need to be answered first, or the code will
explode right in my face. I don't know how long it will take, but I'm working
on it.

