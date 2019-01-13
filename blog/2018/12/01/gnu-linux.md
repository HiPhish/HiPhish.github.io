title: Goodbye macOS, hello GNU/Linux
category: organisation
---


I knew this day would come eventually, so here we are: I moved from macOS to
GNU/Linux as my operating system. It has been a couple of months since then and
I have settled in pretty comfortably; some things are better some things are
worse, and some things are just plain different.

The distribution I have picked is Kubuntu. I did not have the time for
experimenting with a new operating system, so I wanted something that would
work out of the box for the most part and provide sensible default software. I
can still switch to a different distro eventually, but this is where I am for
now. Now it just happened that my switch coincided with Ubuntu abandoning the
Unity desktop environment in favour of Gnome 3, and I don't have the best
opinion of Gnome 3. So I picked the KDE flavour of Ubuntu and it has been
pretty nice.

Why switch in the first place? Well, my old Mac was getting really old, it did
not support the recent macOS releases and security update for my version were
about to stop (the Specre patch was the last one as far as I know). At the same
time Apple was making macOS just worse: more locked down, removing Free and
Open APIs like OpenGL, and the only "improvements" were just further
integration into the iEcosystem. Add to that Apple devices have been getting
even more expensive in recent years. There was no way I was switching back to
Windows either, that would be even worse.

At the same time, the Free desktop environments have been taking notes and made
improvements to the point where I can seriously say that using GNU/Linux is
easier than using Windows or macOS. So here I am, finally on a real Free
Software operating system, as it should be.


## Making KDE more Mac-like

The nice thing about KDE is how customisable it is by default. I was able to
replicate the Mac desktop using only what is shipped by default within a day or
so with no prior experience with KDE.

The first thing I did was remove the existing panels, and instead create a
panel at the top and one on the side. The side panel is my "dock" and the top
panel is the global menu bar.

The dock contains an icons-only task manager widget, a trashcan widget, a
folder view widget for my downloads folder and a couple of handy widgets as
well. This replicates the Mac dock very well.

The top panel contains an applications menu widget, the global menu bar widget
and a whole bunch of status icons widgets on the right. Sadly the global menu
does not work with all GUI frameworks, but most of my applications are written
in Qt, so that's OK.

There are real dock applications like Plank and Latte Dock, but I found that
those don't work as well as a panel with widgets and take longer to load. Yes,
they look fancier, but I don't really care. Functionality is more important
than appearance.


## New and old applications

With a new operating system there comes a new set of applications to choose
from. All my command-line applications I was able to keep, which is very good,
since those are my heavy lifters. My complex [Neovim setup] worked with very few
adjustments as well, so I was able to get back to work very quickly.

What I really miss are the old iWork, iLife and Pixelmator. Those applications
had really nailed the user interface in every detail. I said *old* because
nothing good can last forever, Apple had rewritten iWork and iLife, and the new
applications are really not as good. The old ones would have stopped working
eventually anyway, so I guess I would have had to switch sooner or later
anyway. LibreOffice and Gimp just are not as nice, but oh well, that's what I'm
stuck with, so I'll have to suck it down. Maybe I can use Krita for some image
editing tasks as well.

Unity has been my biggest roadblock in regards to making the switch. There is
still no official Unity Editor builds for GNU/Linux, only the eternal beta.
Since I sell [Grid Framework] I have to be able to run Unity. Fortunately the
beta works good enough for my needs, so I'm good to go.

There is no Wineskin on GNU/Linux, so I settled for PlayOnLinux. Honestly, I
could have used Wine without frontend just fine, but the biggest advantage of
PlayOnLinux is that it lets me have different versions of Wine per program and
switch them out.

[Neovim setup]: https://gitlab.com/HiPhish/nvim-config
[Grid Framework]: http://hiphish.github.io/grid-framework/


## Package management madness

On macOS you don't have a package manager, you use what Apple gives you and you
better learn to like it that way. This is good because it gives you a stable
system of curated packages. It is also bad because if you disagree with Apple's
choice you are stuck.

This is why third-party package managers like Homebrew exist. The cool part
about Homebrew is that it stays out of the system's way: packages are installed
in `/usr/local/` and don't require `sudo`. Actually, packages are not installed
into `/usr/local/`, but `/usr/local/Cellar`, each in its own directory, and
then everything is symlinked into place.

On Ubuntu your package manager is `apt`, it installs every package into the
system directly. If anything happens during an installation of upgrade your
system will be all messed up because `apt` is directly messing with the system
directories. But seriously, how often does that happen? No, the bigger problem
is when you want a more recent version of a package and start adding PPAs. One
or two PPAs are not a big deal, but with every new PPA you are messing with a
curated collection of packages and introducing instability to the system.

This is where distro-agnostic package managers come in. Flatpak is a common
one, it simply bundles the dependencies of each package. However, the real
solution in my opinion at least are functional package managers like [Nix] and
[Guix]. I picked Guix for the time being because I like that it uses Scheme for
its packages, but we'll see about that. I'm trying to do as much package
management through Guix instead of `apt` now.

[Nix]: https://nixos.org/o
[Guix]: https://www.gnu.org/software/guix/


## Password management

To my shame I have to admit that I was using the proprietary 1Password for
years. Yes, trusting a proprietary application with your passwords is a really
bright idea, I know. It was just too convenient to give up, but with that
option gone I had to find a substitute. I think `pass` fits the bill very well:
it uses PGP for encryption, plain text files and directories for storing data
and has a nice terminal interface. Honestly, what more do I even want? This is
the sort of application which you want to be as simple as it can be, because
the more parts there are, the more can break.


## Where to go from here

So what was the point of this post? I don't really know, I guess I just felt
like writing it. I'm very satisfied how things have turned out, so I'm going to
stay like this for the foreseeable future.
