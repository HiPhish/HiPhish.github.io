title: Grid Framework version 1.8.4 released
category: release
---

Version 1.8.4 of Grid Framework has been released. This version updates
Vectrosity support to Vectrosity version 5, and it also changes how support for
other plugins is enabled. It also introduces a new example: an endless grid in
3D space.

   - *Changed:* Support for Vectrosity and Playmaker needs to be enabled
     explicitly now. Please consult the user manual chapter about plugins.
   - *Fixed:* Updated Vectrosity support and examples to version 5.
   - *New:* A new example showcases an infinite grid in 3D.

Plugin support needs to be enabled by defining preprocessor symbols in your
project. The Unity user manual has a
[chapter](http://docs.unity3d.com/Manual/PlatformDependentCompilation.html) on
the topic; my personal choice is to define the symbols project-wide. For that
purpose create a file called `smcs.rsp` with the following example contents:

~~~cs
-define:GRID_FRAMEWORK_VECTROSITY
-define:GRID_FRAMEWORK_VECTROSITY_4

-define:GRID_FRAMEWORK_PLAYMAKER
~~~

The first line enables support for Vectrosity in general and the second line
enables support for Vectrosity 4, which is the legacy version, over whatever
other version might exist. If only the first line is defined the latest version
of Vectrosity is supported.  In the future I will add other symbols as the need
arises, such as when Vectrosity 5 becomes the legacy version.

For Playmaker there is only one symbol. If you also want to use UnityScript you
should define a file called `us.rsp` with the same contents as well. This way
is much cleaner and easier to manage than the way it was done before.
