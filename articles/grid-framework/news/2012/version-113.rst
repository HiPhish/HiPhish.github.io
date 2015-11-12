:title: Version 1.1.3 released
:date: 2012-08-15
:tags: old-blog
:subsite: grid-framework
:category: release

You know, sometimes I look at something and wonder "what kind of idiot designed
this!?", only this time I was the idiot. Let's say you wanted to render a
simple 3x3 grid and you wanted the origin to be in the lower left corner. Well,
you simply couldn't do that, not until now:

.. figure:: {attach}./images/custom-range.png
   :alt: Screenshot of custom range in inspector

Instead of using the size you can now specify your own range, the only
limitation is that From has to be less than To obviously. As a nice extra touch
those two fields will only appear when you you choose to use custom range,
otherwise they will be hidden and won't clutter your view.

**Important note about updating:** Until now you got one folder and had to move the
Plugins folder to the root of your project view manually. This is no longer the
case, Grid Framework should now place all files in their proper directory
without you having to do anything. If you have an older version of Grid
Framework and get errors or warnings please delete all your old Grid Framework
files. This is the last time you will have to do anything manually.

I am sorry for this inconvenience, but there is some common misinformation that
all assets must be in one folder. The fact is you can send your entire "Assets"
folder and the Asset Store Tools will be ignored.
