title: Grid Framework version 1.9.1 released
category: release
---


We are almost  at version 2.0,  but version 1.x  has not been forgotten.  In my
previous post  I was  discussing how  version 2.0  will be  distributed as  one
directory,  including the documentation.  The abuse of the *WebPlayerTemplates*
directory has been a thorn in my side since the start, and since the problem is
solved for version 2.0 I have applied the same fix.

Sadly I was not able to put everything under one directory due to Unity 4:  the
top-level *Editor*  directory is necessary,  otherwise the  inspectors will not
display.  The same goes for examples written in UnityScript.  If you don't need
the examples you can throw them away, but the *Editor* directory has to stay.

None of these  issues exist in Unity 5,  but version 1.x has to support Unity 4
as well,  so there  is nothing  I can do.  Grid Framework  version 2.0  will be
exclusive to Unity 5.
