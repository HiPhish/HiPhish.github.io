---
title: Change of plans regarding Unity3D package
category: progress
tags: v3
---

I have been very excited to be able to make use of the Unity3D package format
for the major version 3 release because it solves a number of problems I had
with the previous releases. Unfortunately I have to dial back somewhat because
the Asset Store only accepts contents stored inside the `Assets` directory of a
project.

Here is the new plan: the core of Grid Framework will be a regular Asset Store
bundle while the align panel, Vectrosity support and Playmaker support still
remain freely available Git packages. The core of Grid Framwork changes as
follows:

- Samples will be moved out of the core into another freely available Git
	package
- The core will have its own assembly definition, this is necessary so that
	external packages can reference it
- Documentation will be included with the core

I have decided to move the samples into a separate package in order to avoid
bloat. In previous releases you would find all the textures, scripts, materials
and shaders from the examples mixed in with your own assets. It is very
annoying. If the Asset Store approval process rejects this, then I will have to
include a minimal example with the least amount of bloat. The final choice is
theirs.

As for the documentation, I consider online-only documentation to be
unacceptable, so now I have the same problem as before: Unity will try to
interpret the Javascript files as Unity Script, and it will treat images as
textures. Fortunately I already solved this problem in the past through some
fancy Unix hackery with `ed` and `find`:

```sh
# Rename all JavaScript files to text files (prevents Unity from compiling them
# as UnityScript files)
for f in $(find manual/html -type f -name '*.js'); 
    mv "$f" "$f.txt"
done

# Rename the PNG files or they will be mistaken for textures by Unity
for f in $(find manual/html -type f -name '*.png'); do
    mv "$f" "$f.txt"
done

# Change the file extensions inside all HTML, CSS and JS files
for f in $(find manual/html -type f -name '*.html' -o -name '*.js.txt' -o -name '*.css'); do
    printf ',s/([_a-zA-Z0-9]*)\\.js/\\1.js.txt/g\n,s/([_a-zA-Z0-9]*)\\.png/\\1.png.txt/g\nw\nq\n' \
    | ed -s -E $f;
done
```

The last part is the most interesting one: I use `printf` to generate commands
which I pipe into the `ed` text editor. The editor `ed` is driven completely
through keyboard commands, there is no visual interface, which makes it perfect
for automation. The final script is quite a hack, but it gets the job done.
