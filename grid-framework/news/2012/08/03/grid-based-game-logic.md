title: Grid-based game logic
tags: old-blog, example
subsite: grid-framework
---

Another video tutorial, showing how to use grid-based game logic in a puzzle
game. This is the tutorial for the lights-out game I mentioned before and which
has been included with the package.

https://www.youtube.com/watch?v=sXlagrglfQ8

This tutorial is written in C# because it uses delegates and events. The reason
why is so that no single tile needs to know about the other tiles, making this
code extremely flexible, you could even change your scene during runtime. If you
don't know about delegates and events I really recommend you to check out
prime31studios' video. Their video series really got me into C# development.

https://www.youtube.com/watch?v=N2zdwKIsXJs

To give you the basic idea, events and delegates mean that somewhere somehow
something happens and some other objects react to that. The object that
triggered the event itself has no idea who (if anyone) is listening and how
they will respond. For example you could have an RPG where when you draw your
sword it makes villagers run away and guards draw their own weapons. Your hero
would not need to know how many villagers and guards (if any) are around, he
just needs to fire the event and all listeners will react accordingly.
