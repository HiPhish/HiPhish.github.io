---
title: Grayjay is not Open Source
tags: rant
category: open-source
modified: 2023-10-24
---

Today [FUTO] released an application called [Grayjay] for Android-based mobile
phones.  Louis Rossmann introduced the application in a video ([YouTube
link](https://www.youtube.com/watch?v=5DePDzfyWkw)).  Grayjay as an application
is very promising, but there is one point I take issue with: Grayjay is not an
Open Source application.  In the video Louis explains FUTO's reason behind the
custom license, and while I do agree with their reason, I strong disagree with
their method.  In this post I will explain what Open Source means, how Grayjay
does not meet the criteria, why this is an issue, and how it can be solved.


## The Open Source definition

The concept of sharing source code for mutual benefit is old, but the specific
term of “open-source software” and its definition have been formulated by the
[Open Source Initiative] (OSI).  Open Source is precisely what the OSI says,
nothing more and nothing less.  There are no degrees of Open Source, software
either meets all of  these criteria or it does not.  These are the points of
the definition:


1. Free Redistribution
2. Source Code
4. Integrity of The Author’s Source Code
5. No Discrimination Against Persons or Groups
6. No Discrimination Against Fields of Endeavor
7. Distribution of License
8. License Must Not Be Specific to a Product
9. License Must Not Restrict Other Software
10. License Must Be Technology-Neutral

The full [Open Source definition] contains clarification on the individual
points.  It is important to understand that this is the exact definition of
Open Source, and if one or more of these points are not met the software is not
Open Source.  It is not “kinda Open Source” or “not as Open Source” or a “more
restricted Open Source”.  This is important because we have seen time and time
again companies try to co-opt the term Open Source and “open-source wash” their
proprietary software to ride the popularity of Open Source software without
actually meeting the criteria.


## Why Grayjay is not Open Source software

The [Grayjay license] contains the following clauses:

> - “non-commercial distribution” means distribution of the code or any compilation of the code, or of any other application or program containing the code or any compilation of the code, where such distribution is not intended for or directed towards commercial advantage or monetary compensation.

> 1. Subject to the terms of this license, we grant you a non-transferable, non-exclusive, worldwide, royalty-free license to access and use the code solely for the purposes of review, compilation and non-commercial distribution.

> 2. If you issue proceedings in any jurisdiction against the provider because you consider the provider has infringed copyright or any patent right in respect of the code (including any joinder or counterclaim), your license to the code is automatically terminated.

The first of these clauses violates the first and fifth point of the Open
Source definition.  It prevents commercial distribution of the program, and
thus it discriminates against persons and groups who wish to distribute the
program commercially.  The wording gives me the impression that modification is
also prohibited, because modification is not explicitly listed.

The second point is weird.  I am not certain, but this too could be considered
discrimination because it revokes the license from people who want to pursue
legal actions against FUTO.  If I write a library under the GPLv3 license and I
find that FUTO has used the code, does that mean I am no longer allowed to use
Grayjay myself if I want to sue FUTO for violating my copyright?

The point is that Grayjay does not meet the criteria to call itself Open Source
software and Louis Rossmann should not make such claims.  We did not let
MongoDB get away with it, we did not let Terraform get away with it, and we
should not let FUTO get away with watering down the term.


## Why commercial redistribution matters

OK, so what if you cannot redistribute Grayjay commercially?  You can still
make changes to the source code and distribute them for free, right?  Well, as
I have pointed out above I am not sure if you can even do that, but for the
sake of this argument let's say that you can.  This misses the point of Open
Source software, it creates what I would like to call maintainer lock-in.

Consider the problem of vendor lock-in: if you rely on proprietary software you
are at the mercy of the developer of said software (which might be a company or
a single person, it does not matter).  The developer can yank the software from
under you, he can change the monetisation model, or he can drop support for the
software.  With Free or Open Source software you could just take over the
responsibility of maintainership or outsource it some other developer you can
trust instead.

Maintainer lock-in is similar.  Let's say Alice develops an application with
maintainer lock-in, but for whatever reason the need for a fork arises.  Bob
has been studying the code and knows how to maintain in properly.  However,
because Alice's code has a non-commercial redistribution clause Bob cannot make
money off his maintainership.  If the software is sufficiently complex that Bob
has to spend a lot of time on it, or if Bob must be able to provide paid
support (e.g. for regulatory reasons) he is not allowed to do so.  Only Alice
can demand financial compensation and thus in practice she is the only one who
can afford to maintain the code.

This is just a roundabout form of vendor lock-in and it is not OK.


## Why is Grayjay licensed like this in the first place?

Louis explains it in his video.  There is another great phone application
called [NewPipe], a video player for YouTube and other streaming websites. Some
people have forked NewPipe, stuffed it with malware or other garbage and put it
under the same name NewPipe on the Google Play Store.  This has created
confusion among users who thought that the modified versions of NewPipe were
the actual NewPipe.  This obviously tarnished the reputation of the real
project.

Louis aims to avoid this problem by prohibiting commercial redistribution and
modification.  And he has promised that FUTO will go after people who break the
license.


## The Grayjay license is the wrong solution

I fully agree with Louis's sentiment, but I disagree with FUTO's solution.
This is an issue of trademark: the purpose of trademark is to make it clear to
the public that “this is my work, it has my branding on it” and I have
exclusive rights to my own trademark.  If you want to distribute a modified
version of my work you are free to do so, but you have to do it under your own
brand or else you are guilty of counterfeiting.

Case in point, the [Firefox] web browser.  The name “Firefox” refers precisely
to the web browser developed by the [Mozilla Foundation].  If someone were to
fork the project and distribute a modified version he would have to do so under
a new name.  This is precisely what [GNU IceCat] and the [Fennec] web browser
are.  And this is fine, it lets me know that I am using a different software.
I can make an informed decision for myself whether I want to use the original
or the fork.

One could argue that pursuing trademark violations is costly and that criminals
don't care about trademarks, but the same can also be said about copyright
violations.

Louis has told us time and time again not to trust him, but to verify his
claims.  This is precisely what I have done.  Louis has misrepresented Grayjay
as Open Source software.  This is disingenuous.  I am hopeful that this was
merely a mistake on his or FUTO's part and that a better solution can be found,
one that prevents the counterfeit problem, but also one that properly respects
the user's freedom.  I am not a lawyer, so my understanding of trademark laws
might be wrong, and I would like to be corrected on that matter.  The ball is
now in FUTO's court and it is up to them to show integrity and at least remove
the false Open Source branding if nothing else.


## On money

As an aside, I want to point out that this is not an issue of money.  Grayjay
is commercial software, it has a price you must pay.  There is nothing to
enforce the payment, it's purely on the honour system.  This does not make
Grayjay donationware though.  Donationware is software which you *may* use
without paying, but you *can* give money if you *want* to.  Grayjay is more
like those boxes at a farm where you pick some eggs or fruits and then put the
correct amount of money in the box; you *have* to pay for the goods you picked,
even if there is no one to enforce it.

I don't have a problem with this.  Actually, I think this is really good.  It
means that once I have fulfilled my moral duty I can just re-download it again
and again without jumping through hoops of account systems, passwords or other
garbage that pirates don't have to put up with.

I just wish the price was actually front and center on the website instead of
making it look like the application was actually gratis.

My issue is with the fact that FUTO wishes to have *exclusive* rights to
monetise Grayjay.  The public should have the right to vote with their wallets
on who they want to maintain their software.  If someone else can do a better
job than FUTO, why should he not get paid?  Yes, FUTO are the ones who spent
money upfront to develop Grayjay in the first place, but they are also the ones
from whom people will be buying at first.  No one is going to pay Bob instead
just because he changed the icon.  But if FUTO were to drop the ball at some
point in the future and Bob were to pick it up, why should Bob not be able to
get paid?


## Update

- 2023-10-24: Reworded some sentences, the previous wording could be
  interpreted as if I was saying that Louis Rossmann is in charge of FUTO.



[FUTO]: https://futo.org/
[Grayjay]: https://grayjay.app/
[Open Source Initiative]: https://opensource.org/
[Open Source definition]: https://opensource.org/osd/
[Grayjay license]: https://gitlab.futo.org/videostreaming/grayjay/-/blob/b5de779916faa1e49721d6a7061632a644472c8d/LICENSE
[NewPipe]: https://newpipe.net/
[Firefox]: https://www.mozilla.org/en-US/firefox/new/
[Mozilla Foundation]: https://www.mozilla.org/
[GNU IceCat]: https://www.gnu.org/software/gnuzilla/
[Fennec]: https://f-droid.org/packages/org.mozilla.fennec_fdroid/
