---
title: Playmaker samples
category: progress
tags: v3, playmaker, packages
---

The new overhauled [Playmaker] bindinds will be shipped as a separate package, so
this lets me finally implement a great jumping-off point for new users:
included samples. The following samples are now included and can be
individually added to or removed from your project:

- Create grid: starting from nothing we create a new game object, add
	a grid component and a renderer component to it, and finally set some
	properties. This example walks you through all the steps necessary to create
	and set up a new grid and make it visible in-game.
- Convert coordinates: coordinate conversion is the bread and butter of Grid
	Framework. In this example we have a grid set up and a `Vector3` variable
	which represents a position in grid-space. We convert the value to
	world-space and use the result to instantiate an object in the scene.
- Resize grid: actions do not have to be a one-off deal, you can run them every
	frame. This example uses Playmaker's own float animation action to smoothly
	transform a floating-point value every frame. We then feed that value back
	into the radius property of a polar grid to make it grow and shrink in real
	time, creating a pulsating effect.

Including these samples would have been impossible if I were to ship the
Playmaker bindings with the core package. Each example carries a Playmaker FSM
(finite state machine) instance, which requires Playmaker classes to be
available at compile time. However, by moving Playmaker support to an external
package I can now include samples without any issue.

These included examples provide you with working minimal examples. You can see
how to set up a FSM and you can experiment right off the bat.


[Playmaker]: https://hutonggames.com/
