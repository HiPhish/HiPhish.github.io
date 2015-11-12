:title: Grid Framework version 1.5.1 released
:date: 2014-10-01
:tags: old-blog
:subsite: grid-framework
:category: release

This release is a hotfix for everyone who was using Playmaker

- Fixed: Compilation errors when toggling on Playmaker actions.

Playmaker actions wil compile correctly now, anyone else was unaffected. So
what happened? One of the problems when developing an extension that relies on
another extension is that it will not compile if the dependency is not present.
For Vectrosity is was easy, I just needed to assemble and array and the user
would then send it over to Vectrosity. Or not, you could do something entirely
different with it as well if you wanted, it's just an array of Vector3.

Playmaker is different though, the actions are classes derived from Playmaker
classes, so if you don't own Playmaker the code will not compile. My solution
was to do the following:

.. code::

   //#define PLAYMAKER_PRESENT
   #ifdef PLAYMAKER_PRESENT
   // code goes here
   #endif //PLAYMAKER_PRESENT

This means the code will only compile if the keyword PLAYMAKER_PRESENT is
defined, which it isn't since the first line is commented. To make the scripts
compile you have to toggle them on through a menu item which then edits the
scripts to un-comment or comment that line. Before I submit a new release I
have to toggle the actions off and so I missed the compilation errors.

It's still a bad oversight on my side and I'm not trying to excuse my failure,
but I wanted to share how this can happen. A better solution would be if
plugins could define keywords globally, then Playmaker could announce its
existence on its own instead of having to toggle things manually.

