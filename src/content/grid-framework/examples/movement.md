---
title: 'Moving along a grid'
instructions: 'Use the arrow keys to move. The hero cannot pass through walls and he cannot step on water. The walls are entries inside the map of the level, the water is outside the map.'
---

This example demonstrates one of the simplest and most common uses for Grid
Framework: converting between coordinate systems. We take the object's current
position, convert is to grid space, add a direction to it, convert the result
back to world space and use that as the destination of our movement function.

```csharp
var goal = grid.WorldToGrid(transform.position);
goal += Vector3.right;ntransform.position = grid.GridToWorld(goal);
```

This on its own is not that interesting, so let's limit the player to the
visible region of the grid. Every grid is infinitely large, but the renderer
has a range we can use as limits before converting back to world coordinates:

```csharp
if (goal.x < _renderer.From.x || goal.x > _renderer.To.x)
    return;
if (goal.y < _renderer.From.y || goal.y > _renderer.To.y)
    return;
```

As a final touch, let's use Grid Framework to store the map of the game. It
will know which tiles are OK to walk on and which ones are obstacles. We will
use a 2D array to keep track of the game; each entry's row and column
corresponds to the tile's X- and Y coordinates in the grid.

```csharp
// After checking for range, before converting to world coordinates
if (!FreeTile(_goal)) {
    return;
}

// Building the matrix
var rows    = Mathf.FloorToInt(_renderer.To.x);
var columns = Mathf.FloorToInt(_renderer.To.y);

_tiles = new bool[rows, columns];

// Checking a tile (grid coordinates)
var r = Mathf.FloorToInt(tile.x);
var c = Mathf.FloorToInt(tile.y);
return _tiles[r, c];
```
