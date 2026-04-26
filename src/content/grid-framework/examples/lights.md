---
title: 'Lights Out'
instructions: "Click a tile and all adjacent tiles swap their colour, the player's goal is to turn off all lights."
---

This example uses events and delegates to make all tiles compare their grid
position to the clicked one's grid position to decide whether to swap colours.
The tiles themselves don't know anything about the rest of the grid.

The core of this example is comparing the grid coordinates of the tiles to the
one tile that was clicked to decide whether to switch colour. The logic is
nicely encapsulated in a custom extension method, making it appear as if has
always been part of Grid Framework.

```csharp
code
    //flip the state of this switch
    isOn = !isOn;
}
```

This extension method is not part of Grid Framework's API, but we can use it as
if it were.
