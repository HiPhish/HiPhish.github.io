---
title: Getting Unity Hub 3 working on GNU/Linux
category: misc
tags: linux, rant
---

Recently I had the misfortune of a data loss, so I had to re-instally my OS
again. But even worse: I also had to re-install Unity on GNU/Linux, which has
been an exercise in frustration and trial & error. In this post I will outline
what I had to do, in the hope that it will be of use to other people.


## The problem

The Unity Hub is distributed in [AppImage] format. And AppImage is one big
container file (similar to a ZIP file) which contains all the dependencies for
running and application. Unlike a ZIP file though, an AppImage can be executed
to run its bundled application. This is quite handy, but there is a problem:
the OS has no idea what an AppImage is. As far as the OS in concerned it is
just another file, it does not know how it fits into the bigger picture.

In my case I had three issues:

- I was unable to log in
- No Unity Hub links worked
- Engines did download but would not install

The first two issues have the same cause and can be fixed completely. The third
issue requires manually moving files into place by hand.


## The solution

TL;DR: Create a desktop entry for the Unity Hub, register it as the handler for
`unityhub://...` URIs and then install Unity engines by hand.


### Registering the Unity Hub as an application

On GNU/Linux a program is just some file on the disc, so we need to specify
additional information in some central location for the desktop environment to
pick up on it. This information lets other applications route instructions
properly.

#### The desktop entry definition

Let us first define the Unity Hub application itself. Create the file
`~/.local/share/applications/com.unity.unityhub.desktop` with the following
content and make it executable:

```desktop
[Desktop Entry]
Type = Application
Name = Unity Hub
Exec = /path/to/UnityHub.AppImage %u
Categories = Development
MimeType = x-scheme-handler/unityhub
```

This file specifies two important properties:

- `Type`: this is an application
- `Exec`: the command for the OS to execute, the `%u` argument is vital here
- `MimeType`: which file types (or URI schemas in this case) the application
	will able to handle

The other lines are not important, you can change them to your liking. For more
information please refer to the [XDG Desktop Entry] specification. The file
name of the desktop entry file does not matter, but the file path does.

To be precise, the file path can be any path from the
`$XDG_DATA_DIRS/applications`. For more details please refer to the [XDG
Desktop Menu] and [XDG Base Directory] specifications. I have not tried placing
the Unity Hub in a system-wide location, but I would advise against placing any
proprietary mystery binaries in the system anyway.


#### Registering the MIME type

So far we have only declared that the Unity Hub exists and that it can handle
URIs of the form `unityhub://...`, but we have not instructed the OS to
actually assign the Unity Hub as a handler for that URI schema. Without this
information `xdg-open` will not be able to resolve `unityhub://...` URIs.

Run the following line of code in your shell:

```sh
xdg-mime default com.unity.unityhub.desktop x-scheme-handler/unityhub
```


#### Words of caution

- The path to the AppImage has to be absolution, i.e. not
	`~/Applications/UnityHub.AppImage`, but
	`/home/jdoe/Applications/UnityHub.AppImage` (or whatever your user name is)
- Launch the Unity Hub from your applications menu, not directly from the
	command line. If you have to use the command-line, then launch the desktop
	entry file instead
- Be patient, Unity Hub is very slow to react when you click a link in the
	browser. I don't meant a couple of seconds, but a couple of minutes.


### Manually installing engines

In my case whenever I tried to install an engine through the Unity Hub
everything would download fine, but then the installation would fail with the
completely useless message of `Install failed: Installation Failed`. We can
tell the Unity Hub to use a local copy of the engine instead. Unfortunately
while there are download links for Windows and macOS, there are none for
GNU/Linux.


#### Manually installing an engine

- Download the engine normally through the Unity Hub
- When the installation eventually fails cancel the entire process
- The downloaded files can still be found in the `/tmp` directory as tarballs
- Create a directory `/path/to/engines/<version>`
- Extract all the tarballs corresponding to that version inside the above
	directory

Here is an example of what the truncated directory structure looks like on my system:

```
$ tree -L 3 /home/hiphish/.local/share/UnityHub/Editor/2020.3.19f1
├── Documentation
│   └── en
└── Editor
    ├── BugReporter
    ├── Data
    ├── Unity
    ├── Unity_s.debug
    ├── libOpenImageDenoise.so
    ├── libRL.so
    ├── libRadeonRays.so
    ├── libRadeonRays.so.2.0
    ├── libembree.so
    ├── libfbxsdk.so
    ├── libfreeimage-3.18.0.so
    ├── libispc_texcomp.so
    ├── libre2.so
    ├── libre2.so.0
    ├── libtbb.so.2
    ├── libtbbmalloc.so.2
    └── libumbraoptimizer64.so
```

If the tarballs have overlapping directories you should merge them. This can be
the case for example if you downloaded extra build support.


#### Words of caution

- Since the downloaded files do not indicate the editor version I strongly
	recommend doing the above steps for one version at a time.
- There does not seem to be a way of adding extra modules after the fact, so
	choose wisely
- Sometimes the Unity Hub shows an engine version mismatch for my project, even
	though I have selected the correct version; it's annoying, but harmless


## Further reading

- [AppImage] website
- [XDG Desktop Entry] specification
- [XDG Desktop Menu] specification
- [XDG Base Directory] specification

[AppImage]: https://appimage.org/
[XDG Desktop Entry]: https://freedesktop.org/wiki/Specifications/desktop-entry-spec/
[XDG Desktop Menu]: https://specifications.freedesktop.org/menu-spec/
[XDG Base Directory]: https://specifications.freedesktop.org/menu-spec/
