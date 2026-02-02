---
title: The game modding scene has a source code problem
category: misc
tags: games, rant
---

Sometimes I like to play video games.  Sometimes these games have issues, or
they can be improved upon.  Sometimes these issues are so severe that the game
is virtually (or even literally) unplayable.  Fortunately some really smart
people have done a fantastic job reverse-engineering parts of these games,
their file formats, or found workarounds for engine limitations.  Unfortunately
too often that knowledge never gets written down and just keeps rotting in
someone's head.

Code rots. Operating systems change, APIs get deprecated, a framework which was
once the hottest new thing on the block fails to even compile, the server you
have been using for hosting shuts down.  Are you still going to be there in
five years to update the application? What about ten years? People move on,
they get bored, they get new responsibilities which demand their time.  And
that's OK, you do not owe us your time and we are grateful for what you have
been able to produce so far.

However, do us at least the courtesy of releasing the source code under a Free
and Open Source (FLOSS) license.  Even better, write documentation.  It is
unreasonable to expect you to keep updating your mods forever, but it is
reasonable to expect others to be able to carry on the torch after it has been
abandoned.

Here are a number of key issues I have come across over the years.  I am not
going to provide examples because there are simply too many and I don't want to
single out any particular modder.

- No source code for mods or utility application
- No documentation of reverse-engineered file formats
- No specification for custom-made file formats (e.g. a custom mod archive
  format)
- No specification for custom scripting languages
- Restrictive licenses for mods

The first four points can be excused as ignorance or laziness.  But the last
point makes me particularly angry (which is probably not healthy).  There are a
lot of mods with restrictive licenses that prevent modifications or even
uploading them to other websites.  Seriously, why? What are you getting out of
this?  You are not selling the mod.  Is it an ego thing?  Are you concerned
about other modders ripping off your work for their mods?  There are [Creative
Commons] licenses which require attribution (BY) or which require derived works
to be under a share-alike (SA) license if that is really a concern.

I come at this from the perspective of someone who is active in the FLOSS
ecosystem.  Whenever I release some software to the public I do so in a way
that makes is possible for someone else to pick up my work.  I cannot be around
forever, and I might lose interest in a project.  Therefore it is important
that I do not become a gatekeeper.  There always has to be an escape hatch.
Forking comes perfectly naturally to us.  Sometimes we fork software for our
own needs, sometimes with the intent to contribute back, and sometimes we
actually do make hard forks.

Let me conclude this blog post with a couple of suggestions on how to properly
set your work free.

- For source code choose a license [approved by the Free Software Foundation]
  and [approved by the Open Source Initiative]
  - The choice usually comes down to a permissive license (can be used in any
    derived work) and copyleft (derived work has to be under the same license
    as well)
- For assets (graphics, music, etc.) choose a Creative Common license
- Add a proper licensing file (usually called `COPYING` or `LICENSE`) with the
  full text of the license and your copyright information to the project.
  Without this file it is impossible for other people to abide by the terms of
  the license
- Add a README file to your project with the most important information
- State in the README where the official download location is since people can
  re-upload your work on other sites as well. This will prevent fragmentation.
- If your mod is mostly code host it in a source control repository
  - Actually, you can host it on multiple repositories and keep them
    automatically synchronized; I host all my code on GitLab but mirror it on
    GitHub as well
- Ideally you should also document file formats, but if that's too much work at
  least provide some hint as to where in the code the file formats are
  implemented

This might sound like a lot of extra work at first, but really the only extra
step you need is to pick a license and add the license file.  Your project is
probably under source control and has a README already.

This post is inspired by my recent experience with Anno 1503 which I wrote
about in a [previous post].  The author of the hack was able to increase the
resolution of the game and made the modified EXE files available, but he only
explained his method after being explicitly asked about it.  I don't think it
was malice or an ego thing on his part, but rather just ignorance of the
greater issue. Download links get broken, servers get taken down, but knowledge
on how to reproduce the hack survives.  Please let us make sharing knowledge
the default.


[Creative Commons]: https://creativecommons.org/
[approved by the Free Software Foundation]: https://www.gnu.org/licenses/license-recommendations.html
[approved by the Open Source Initiative]: https://opensource.org/licenses/
[MIT (Expat)]: https://spdx.org/licenses/MIT.html
[GNU GPL Version 3 or later]: https://spdx.org/licenses/GPL-3.0-or-later.html
[previous post]: /blog/2023/04/05/resolution-patcher-for-anno-1503/
