---
title: 'Seemingly Endless Grid'
instructions: 'Use arrow keys to scroll the camera, hold shift to scroll faster.'
---

The grid's rendering range is only adjusted when the camera reaches the edge of
the grid, and that prompts the grid to re-calculate its points. This gives us
the illusion of a seemingly endless grid while we only render what's within
close reach. This is cheaper performance-wise than rendering a huge grid when
the player will only see a small part of it at any given time.
