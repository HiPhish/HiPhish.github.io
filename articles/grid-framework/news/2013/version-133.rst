:title: Grid Framework version 1.3.3 released
:date: 2013-08-28
:tags: old-blog
:subsite: grid-framework
:category: release

Grid Framework version 1.3.3 has been approved by the Asset Store team. This
update adresses a bug introduced in version 1.3.2 where values of colour
vectors (such as axisColor) and bool vectors were not persistent. Now they will
stick again. I also broke the examples for the sliding puzzle and movement with
obstacles, which are now fixed. Based upon a customer's question I also built a
snake game example; it's mostly an extension of the grid-based movement but
with several snake segments following each other.

And last, but for some people certainly not least, if you delete the local
documentation (found in the WebPlayerTemplates folder) the help menu entry will
forward you to an online documentation instead. Some customers complained about
me cluttering their project with that folders, and they are right, but
unfortunately that's the only place where I can place the files, or else Unity
will try to compile the JavaScript files and throw a ton of errors.

The documentation files are all contained in that one folder, so you can either
uncheck it when importing, delete the folder after import or move it somewhere
else. I know this is inconvenient, but unless Unity provides me with a proper
way to bundle offline documentation this is the best I can do.

