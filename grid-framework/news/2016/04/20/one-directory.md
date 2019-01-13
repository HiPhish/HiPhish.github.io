title: One unified directory
category: progress
---


In version  1.x Grid Framework  has been distributed  over several directories:
*Plugins*,  *Editor*,  *WebPlayerTemplates*  and  *GridFamework*.  I  did  this
because  it seemed  logical to  split the  content by purpose,  but some people
disagreed with my choice,  so for version 2.0  everything will unify everything
in one directory.

Here is what it looked like before:

~~~
Assets
├─Editor
│ └─Grid Famework
│   └─...
├─Grid Framework
│ └─...
├─Plugins
│ └─Grid Famework
│   └─...
└─WebPlayerTemplates
  └─Grid Framework Documentation
    └─...
~~~

And this is what it looks like now:

~~~
Assets
└─Plugins
  └─Grid Famework
    ├─Changelog.md
    ├─readme.txt
    ├─Editor
    │ └─...
    ├─Examples
    │ └─...
    ├─Extensions
    │ └─...
    ├─Grids
    │ └─...
    ├─Interfaces
    │ └─...
    ├─Matrices
    │ └─...
    ├─Playmaker Actions
    │ └─...
    ├─Renderers
    │ └─...
    ├─Rendering
    │ └─...
    ├─Resources
    │ └─...
    ├─Test
    │ └─...
    └─Vectors
      └─...
~~~

Now all  of Grid Framework  is confined to  one directory inside your project.
There is one  downside though:  UnityScript source files  are compiled after C#
source files in the *Plugins* directory. This means that examples can no longer
be written  in UnityScript.  My choice was  to either rewrite  the  UnityScript
examples or  give up  the unified  directory.  I have  chosen  the former,  the
examples are simple enough  that even people  unfamiliar with C# can understand
them and most of the examples cannot be implemented in UnityScrip anyway. In my
opinion Unity has done us a disfavour by  having two languages when one of them
is a second-class citizen, and pushing that one as the default.

Finally,  I still haven't figured out what  to do with the *WebPlayerTemplates*
directory. I have been distributing the documentation in that directory because
otherwise Unity would try to compile  the JavaScript files as UnityScript files
and  fail.   It  is  unacceptable   to  publish  a  framework  without offline
documentation,  but at the  same time I  don't like  abusing the  directory and
spamming  people's project.  One idea  would be  to ZIP  the documentation  and
include it like that. Another possibility would be to change the file extension
of every JavaScript file to for example  `.txt`,  but then I would also have to
change every reference in every HTML and JavaScript file as well.
