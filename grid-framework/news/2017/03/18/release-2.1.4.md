title: Grid Framework version 2.1.4 released
category: release
---


Grid Framework version 2.1.4 has been approved by the Asset Store.  This update
fixes the algorithm for finding the nearest face in a hex grid,  and it changes
how images in the documentation are handled.

In previous  releases images  were just  regular PNG  files inside  a directory
structure,  which meant  they would  clutter up  your texture  selector because
Unity  did not  know  that those  images  were  never intended  to  be used  as
textures.  The solution to this was very simple,  it's the same trick I already
used before to prevent Unity from compiling the Javascript files: add `.txt` to
the file extension.  The browser does not care about  file extensions and Unity
ignores the images now

Speaking of  documentation,  somehow the 2.1.3 build  shipped without it.  That
issue is now solved as well.

Finally, the minimum required version of Unity had been bumped to 5.5 in 2.1.3;
I have no idea what I was thinking, but the minimum version is now back to 5.0.
Feel free to upgrade to this version if you were holding off on 2.1.3.

Speaking of 2.1.3, there were no announcements for it and 2.1.2 on the blog. Up
until this year  I had always been getting  an email from Unity when  one of my
update submissions had been approved,  but not anymore recently.  I had thought
that 2.1.2 had simply been stuck in the bureaucracy forever, and when I finally
found out  that it had  been release  there was really  no point in  writing an
announcement anymore. Same with 2.1.3 as well.

The  2.1.2 update  fixed an  issue  with "index  out  of range"  errors in  the
Vectrosity example,  It did not affect any of the actual library code.  Version
2.1.3  replaced the  old  ugly examples  with more  presentable  ones that  use
sprites instead of graphics primitives.
