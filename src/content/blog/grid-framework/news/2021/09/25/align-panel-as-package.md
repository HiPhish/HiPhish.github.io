---
title: Align panel as a package
category: progress
tags: v3
---

I have decided to move the grid align panel into a separate package as well.
There are a number of reasons for removing it from the core package:

- The panel is not useful as a dependency for other scripts
- It adds menu clutter to Unity for people who do not need it
- I don't expect that many people to have use for it compared to the core
- Installing a Git package is trivial

None of these points are particularly strong, but I cannot think of any
downsides, so the decision was an easy one to make. In return I have added a
sample to the package: a playground scene with some grids and objects you can
move around and experiment with the different options. Such a sample would be
pointless in the core, but it is appropriate for an external package.
