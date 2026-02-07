---
title: Embracing the Unity package system
category: progress
tags: v3, packages, vectrosity, playmaker
---

When I released version 1 and version 2 of Grid Framework there was no real way
of separating libraries. You had to dump everything into your project in one
assembly. Using namespaces prevented name collisions, but you still had things
like examples or documentation bloating up your project and there was no way of
expressing dependencies. Since then Unity has introduced its own [package system],
which will solve many of the problems I have had in the past.

Since version 3 is a major upgrade, I am dropping backward compatibility with
prior versions of Unity, which means that I now have the opportunity to make
Grid Framework a proper package. A package allows me to do the following:

- define metadata (like version number) which will be available in Unity
- separate runtime scripts and editor scripts into distinct assemblies
- separate examples from the actual library

Packages can be distributed in different ways, including as a public Git
repository. This solves the massive thorn in my side that is [Vectrosity] and
[Playmaker] support. If someone does not have either of those dependencies they
would get compilation errors. My solution so far was to wrap the code inside
`#if` [preprocessor directives], but this required people to define extra
preprocessor symbols in their project and it would still bloat Grid Framework
for anyone who did not need those integrations.

With packages the solution is simple: I can just implement each integration in
its own package and make it available as a public [GitLab] repository. There is
no need to go through the Asset store for something this simple. It also means
that other integrations could easily be published without having to update the
main package.

This only one problem: the documentation. It appears that Unity wants package
documentation to be either one Markdown file or a link to some online
documentation. The former may be appropriate for something simple, but not for
a library this large. The latter is unacceptable in my opinion, if your
internet broke down you would be stranded without any documentation. I will
have to see what can be done. At least I will no longer have to rename all the
images and generated Javascript files to prevent Unity from importing them as
game assets.


[package system]: https://docs.unity3d.com/Manual/PackagesList.html
[Vectrosity]: https://starscenesoftware.com/vectrosity.html
[Playmaker]: https://hutonggames.com/
[preprocessor directives]: https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/preprocessor-directives
[GitLab]: https://gitlab.com/HiPhish
