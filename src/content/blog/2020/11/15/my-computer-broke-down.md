---
title: My computer broke down
category: organisation
tags: rant, unix
---

There are two types of people: those who make backups and those who will
experience a system breakdown. Fortunately I was in the former category, but it
was still a very tedious and stressful experience. Every problem is also an
opportunity to grow and throw off dead weight, so I used the opportunity to
upgrade the hardware and switch my operating system.


## What happened

At some time in early October my computer froze while I was using it. Just a
kernel panic I figured, an uncommon occurrence, but not big deal. Just reboot,
right? Well, that's where the trouble began. I was not able to get a graphical
session running, except for “safe mode”, whatever that might be. The problem:
safe mode lacks hardware acceleration, so it might as well be a text-only mode.

I decided to just do a complete re-install of the OS since I did not feel like
diagnosing the issue. After all, it had been running for a couple of years, and
probably had a bunch of cruft accumulated from various PPAs and stuff. If only
I had know the rabbit hole I was about to go down.

The first issue was that my [Kubuntu](https://kubuntu.org/) USB drive would not
boot, probably because of the same reason Kubuntu would not boot properly off
my internal hard drive. Oh well, I have been wanting to switch to
[Void](https://voidlinux.org/) for quite a while, so I might as well do it now.


## Enter the Void

Void is a rolling release minimal GNU/Linux distribution. That means all
packages always contain very recent releases and it comes with the bare minimum
of software out of the box. No graphical environment, just a TTY, a shell, the
vi text editor and enough to hook you up to the network. (There are also
flavours which come with complete desktop environments, but real men go for the
pure TTY experience)

One thing I really like about Void is [its
documentation](https://docs.voidlinux.org/). You get a proper user manual
instead of just a wiki. Installing Void was pretty straight-forward thanks to
the manual. One must be able to use vi though, as that is the only editor
installed by default, and thus the only way of editing text files.

My first problem was getting the WiFi working. For whatever mysterious reason
my router's configuration did not play well with Void. Probably because it was
still using WEP encryption which is almost as bad as no password at all. Why
was I using WEP? I don't remember. Maybe WPA was hard to set up, maybe because
I wanted to play the Nintendo DS online (which I did for a total of like five
times). I just never bothered with changing the configuration.

Anyway, so I first had to change the WiFi settings of the router. But that
requires a graphical web browser, so I had to somehow get my hands on *another*
computer with a running GUI. After I did that I tried logging into my router
interface, but for some reason the web interface was about as responsive as a
dead snail, making it unusable. So I needed to get my hands on another router
as well.

Eventually, after an entire day of fussing around with operating systems, USB
drives and W-LAN routers, and with help from the friendly people on the Void
IRC, I had the network connection working. My sunday was ruined, but from now
on it would be smooth sailing. Just install Xorg, a nice desktop environment
and slowly build up my old configuration.


## Back to the toaster

I just could not get a graphical environment working. It was Monday already and
my day was spent staring at a screen all day at work, then coming back home and
staring at a screen (monochrome this time) for even more hours trying random
tips from the internet to get graphics working. In the end I had to give up.

I suspect that either my graphics card or my mainboard were broken. The
computer was quite old, so I decided I might as well take the opportunity and
get complete upgrade. But of course I would not just go and buy a PC off the
shelf, loaded with proprietary bloatware that might as well be malware at this
point.

But what should I do in the meantime? I needed *some* kind of computer. That's
when I remembered an old PC stashed in the basement. I dubbed it the toaster
because it was small and pretty cheap even ten years ago. It even originally
came with [FreeDOS](http://www.freedos.org/) as its operating system. So here
is what I did: I opened up the case, unplugged the S-ATA cables from its hard
drive and optical drive, and hooked up the hard drives from my computer,
leaving the case open and the cables dangling out there.

The best part: this Frankenstein hack-job worked really well. I got a graphical
KDE Plasma environment running on Void and it was really smooth. By all
conventional logic such an old computer, which was underpowered even when it
was new, should have been junk. But there I was doing my everyday work without
any issues. The only problem was the web. So-called modern web development is
an atrocity, loaded with Javascript, trackers, advertising, client-side
computation and whatever technological abuse some web-dev hipster could throw
at it. It really makes you think, doesn't it? How many of our appliances could
still be kept instead of being thrown out, if software did not keep getting
more and more bloated.


## Life in the Void

I have be honest: I don't really understand why people love Void so much. It's
just a distro, I set it up, I configure it and then I use it. Perhaps that
actually is the appeal of it. With Kubuntu it was all just magic, I inserted my
bootable live USB drive, clicked a few buttons, and had a working OS. How does
it work? What components are included? I don't know. On Void since I connected
all the parts I know what is inside. I actually feel confident when editing a
configuration file.

Void uses [runit](http://smarden.org/runit/) as its init system instead of the
more common [systemd](https://systemd.io/). I could never figure out systemd,
it did so many things at once. I was able to figure out runit in a few minutes
because it re-uses what the OS already provides whenever possible. A startup
script is just a shell file, a service is just a directory, and enabling a
service just means symlinking the service directory. If you know how to use
Unix you already know 90% of how to use runit.

And as I mentioned above, it has an actual user manual.

I think I have my new computer set up pretty well now and I have settled into
Void. Knowledge of Unix is a prerequisite when not using one of the flavours,
but you don't have be a systems administrator either. It is nice that I can now
finally use recent software in a sane way instead of jumping through hoops or
using crap like [snaps](https://snapcraft.io/) and
[flatpaks](https://www.flatpak.org/). Maybe I will be able to contribute some
packages of my own eventually.


## My new computer

I had the choice between either building my own or having it custom-built for
me. I chose the latter. The way I see it, having it custom-built was more
expensive, but in return I get local customer support, I can just hop on my
bike and have a technician look at it in person, I get a warranty for the
entire machine, and I don't have to put up with a different retailer for every
individual part. If I was still a student with less time than money I would
have gone for the former, but age and time changes priorities.

An advantage of a custom computer is that I can choose to omit certain parts
from the build. For example, my SDD was still quite new, and the optical drive
was fine, so I just omitted those from the new configuration and salvaged them
from the old computer.


## Finishing thoughts

There were three main sources of stress: Uncertainty, the anxiety of missing
out on something important (like an email), and the lack of time.

Uncertainty means I did not know what the problem was; if you do not know the
problem, how can you know the solution? Is it a software issue? Did the
hardware fail? If it is a software issue, then throwing out the old hardware
and buying new one won't do you any good.

Fear of missing out could be alleviated by having a second computer or another
device I could get work done on. Luckily the toaster was able to fill in that
role eventually, but there are limits as to what it could do.

Lack of time is perhaps the biggest stress factor. If you have spare time you
can calm down and investigate the problem in detail, search for a new device to
buy, dig through stashes of spare parts... but if you don't have time then
nothing can help you. Even money becomes useless because you still need time in
order to make an informed purchasing decision. You can always get more money
one way or another, but you can never get more time.
