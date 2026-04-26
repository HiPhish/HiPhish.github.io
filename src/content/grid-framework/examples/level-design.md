---
title: 'Assembling a level from data'
instructions: 'Click to the button to cycle through level layouts.'
---

The core of this example is the position of a entries in the array, i.e. the
row and column. We use these array coordinates as grid coordinates and convert
them to world coordinates.

```csharp
HexGrid grid;     // The grid we use for out game
int column, row;  // Given data in grid coordinates

var  gridPosition = new Vector3(column, row, 0);
var worldPosition = Grid.GridToWorld(grid-position);
```
