---
title: The problem with contributing to Open Source
category: open-source
tags: rant
---

I love Free (Libre) and Open Source Software (FLOSS); not only does the
software respect your personal freedom, you can also contribute back to make it
better. It becomes a communal cooperative effort. But just because you can
contribute, that doesn't mean that you necessarily should.

Contributing bug fixes is simple, the software has an intended way of how it is
supposed to work, but its actual behaviour is off. You can swoop in, restore
the intended behaviour and that's it. Everyone is happy. However, if you want
to contribute a feature things get less clear. Or maybe you want the project to
run on a different system. Or translate it to another language. Or improve the
documentation. Now you are not restoring something that was broken, you are
adding to the project.

The addition needs to be maintained. Only the most trivial additions can be
“fire and forget”, everything else needs a maintainer. Will the original
maintainers be able to keep maintaining your addition? Are you willing to take
over responsibility and become a co-maintainer? There can be a number of
reasons why the original maintainers might not be able to maintain your
additions: maybe they don't have the system you have ported the project to,
maybe they lack the skill, maybe they just don't care about the new feature,
maybe they don't speak the language you have translated to.

But why does the addition need a maintainer anyway? Why can't we just call it
quits and move on? I believe that a broken feature or incorrect documentation
is worse than not having it at all. Users might rely on a feature that works
90% of the time, only to be bitten by that 10% at the worst of times. Users
might read the documentation, follow it, and be baffled that something works
differently or does not exist.

I have found myself quite often in this position. One thing that has been
driving me up the wall recently with [Neovim] plugins is how many of them have
miserable or non-existing documentation. I fancy myself as a pretty decent
documentation writer, so it would be easy for me to swoop in, write a proper
manual and drop it off at the doorstep. What stays my hand in the end is that
nagging feeling of what will come later. I don't have the time to become the
dedicated technical writer for a dozen projects, and if the original authors
really cared about quality documentation they would have written it themselves
to begin with (if you know how to write plain text you know how to write Vim
documentation, see `:h help-writing`). My only conclusion is that they don't
care, and if the maintainers don't care, why should I? And so I move on, to the
detriment of everyone.

Please don't take this the wrong way, I am not saying that contributing to a
FLOSS project is bad. I am saying that there must be some long-term plan for
how that feature is supposed to live on. Even if you are not wiling to become a
co-maintainer there are some steps to help ensure the existing maintainers can
take over the feature:

- Ask if there is interest in the feature; no one wants to maintain something
  they don't care about
- Document how the feature works; no one wants to maintain something they don't
  understand
- Document possible points of breaking; no one wants to dig through someone
  else's mess to find the one weak spot
- Write tests; no one wants to manually try out things after each change

Even if the current maintainers end up neglecting the feature, having
documented and tested your design makes it easier for another user to take over
maintainership. And that other user might very well be you half a year after
the fact.

[Neovim]: https://neovim.io/
