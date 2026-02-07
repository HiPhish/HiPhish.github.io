---
title: Free Software is necessary but not sufficient
tags: rant, unity3d
category: open-source
---

Recently Unity [announced changes to their pricing model] ([archive]) which
have been very poorly received by their users, to put it gently.  They have
since [backtracked] ([archive2]) somewhat, but at this point it would not
matter even if they completely scrapped their plans and went back to how things
used to be.  The trust has been broken and many game developers are waking up
to the fact that Unity is effectively holding their project hostage.  Switching
from one engine to another is akin to a full rewrite, and depending on the size
and progress of the project porting might not be a feasible thing to do.

This brings me to the title of this post.  Free and Open Source Software is not
some sort of magical solution.  FLOSS is written by humans who are susceptible
to the same temptations as anyone else.  However, here is the big difference:
with FLOSS we always have an escape hatch.  We can audit the code for malicious
features, we can make changes, and if necessary we can fork the code.  Even if
I myself cannot do it, someone else can.  This person or group can fork the
code, maybe set up a fund and we are back in business.  The point is, there is
always an option.

Case in point: the (web browser pretending to be a) text editor [VSCode] is
developed by Microsoft under the MIT (Expat) license and forms the basis of
[Visual Studio Code] (yes, VSCode and Visual Studio Code are different things).
Microsoft takes VSCode and adds telemetry to Microsoft servers and probably
other spooky stuff to it.  This is not a conspiracy theory, we can see the
telemetry code in VSCode ourselves and they even [admit it]. However, because
this is Free Software we don't have to just take it. The [VSCodium] project is
a soft fork of VSCode free of telemetry and other spooky stuff.

The same goes for game engines.  Currently [Godot] is rising in popularity, in
particular because it is Free Software.  One day the Godot developers might
decide to sell out, or the project might get abandoned.  Or any number of bad
things might happen.  This would be a setback to game developers, but it would
not be the end of it.  The engine is still there, it cannot be taken away, and
new group of maintainers can form.  Sure, it will be a large effort, but it can
be done.

Free Software is a necessary prerequisite, but it is not a guarantee.  And this
is fine.  We cannot expect a software project to go on forever under its
current maintainership, but we must expect the escape hatch to exist in case
Godot pulls a Unity.  If you pick Unreal as your new engine you don't have that
escape hatch, you can just cross your finger and hope Epic does not pull a
Unity as well.  Are you willing to bet on that horse again?

As for me, I'm not glad Unity is dead, but I'm glad it is gone.  Unity was the
last proprietary software I had, and only because of [Grid Framework], and I
have spent way too much time fighting it from digging itself into the OS where
it does not belong.  I have not yet decided what to do with Grid Framework, but
it's pretty certain that no more money will be coming in from it.  This was
going to happen sooner or later anyway, so I'm not even upset.  I'm just glad
that I have not bet my livelihood on Unity.



[announced changes to their pricing model]: https://blog.unity.com/news/plan-pricing-and-packaging-updates
[archive]: https://web.archive.org/web/20230912155736/https://blog.unity.com/news/plan-pricing-and-packaging-updates
[backtracked]: https://blog.unity.com/news/open-letter-on-runtime-fee
[archive2]: https://web.archive.org/web/20230922172144/https://blog.unity.com/news/open-letter-on-runtime-fee
[VSCode]: https://github.com/microsoft/vscode
[Visual Studio Code]: https://code.visualstudio.com/
[admit it]: https://github.com/Microsoft/vscode/issues/60#issuecomment-161792005
[VSCodium]: https://vscodium.com/
[Godot]: https://godotengine.org/
[Grid Framework]: /grid-framework/
