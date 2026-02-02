---
title: Playing Sid Meier's Civilization III in Wine in 2022
tags: wine, games
category: misc
---

A few days ago I wanted to re-install Sid Meier's Civilization III on my
machine and play it again. This blog post is a summary of the tricks I had to
use to make it work it work well; I am writing it down for posterity, maybe
someone else will find it useful. That someone might even be future me.

The following was done using the retail releases of the base game and the
Conquests expansion (which includes the Play the World expansion). I expect
readers to already be familiar with [Wine]; I will only cover the extra steps
needed, this is not a step-by-step guide.

The following was tested in Wine 7.10, in a 64bit prefix, using X11 on
[Void Linux].


## Installation and official patches

Nothing out of the ordinary here. Install the base game, then install the
expansion (into the same Wine prefix of course). Finally install the correct
official patch for your game.

To find out which version number you have without launching the game you can
open the relevant README file in a text editor. Starting from the install
directory of the base game there are:

- `README.txt` (base game)
- `Civ3PTW/readme.txt` (Play the World expansion)
- `Conquests/readme.txt` (Conquests expansion)

In my case the Play the World file did not have any version number, but that
might be because Conquests already includes Play The World. 


## CD copy protection

When I try running the game Wine prints the following error to standard error:

```
013c:err:ntoskrnl:ZwLoadDriver failed to create driver L"\\Registry\\Machine\\System\\CurrentControlSet\\Services\\SecDrv": c0000142
```

This seems to be a problem with the copy protection (DRM) used by the game. I
have not found any solution, other than either using a No-CD patch or buying a
DRM-free version. CivFantatics (see below) are hosting a No-CD patch extracted
from a gaming magazine release. Yes, you are installing a mystery binary, but
that's probably the least shady place to get it if you want to go that route.

The files were taken from the [website of PCGames], so if you don't trust the
download from CivFantatics you can also download the original files. Here are
the SHA-256 checksums I got from the official download:

- `Civilization3.exe` (v1.21f without expansion): `6e57a1ab94eb005e4ba688dd7a30cd19698a7f3fe3357ead901058be5ae67704`
- `Civilization3.exe` (v1.29f with expansion): `98f07e9b4acd756c4eeef3eaf84afccdc17189ef933186b2001259247cd0a067`
- `Civ3Conquests.exe` (v1.22): `fbb9ae4c6fa9ece58e065b6396b25d693630afefe0cc45b31fc66914d1b44990`

This is as trustworthy as it gets with proprietary software.


## Black terrain

As of the time of writing this there a bug in the `libOSMesa` library that
renders all terrain on the map as a black surface. The good news is that we
don't need this library for the game, so we can trick the game into using a
fake library.

Create a directory and add an empty file named `libOSMesa.so.8` (or whatever
the real one is named on your system), then set the `LD_LIBRARY_PATH`
environment variable to the path of that directory. We can for example start
the game with this command:

```sh
LD_LIBRARY_PATH="path/to/fake/lib/" wine 'Civilization3.exe'
```

I use a small launcher shell script so I don't have to type all of this by
hand.


## Broken fullscreen mode

By default Civ3 only runs in fullscreen, but instead of running in a real
fullscreen mode on top of all other windows, it lowers the resolution of the
screen and runs in a window. Maybe this happens because I am using a tiling
window manager ([bspwm]).

The solution is to not allow the window manager to control the windows. Open
`winecfg` and uncheck the box in the “Graphics” tab. We can do this globally for
all applications, but then the map editor will also be affected, which you
probably don't want.

To set this option only for the game go to the “Applications” tab, click “Add
application” and select the executable of the game. Then, while the game
executable is highlighted uncheck the box in the “Graphics” tab. Repeat the
same steps for the expansion executable as well.

This is all documented in the Wine wiki: [Using
winecfg](https://wiki.winehq.org/Winecfg#Using_winecfg)



## Infinite sound effects loop

The last issue is more of an annoyance than a real game breaking problem.
Sometimes the game will be stuck playing an audio effect in an endless loop. It
is the most annoying when it gets stuck replaying bird voices or the cheering
crowd whenever you upgrade your palace.

I am not aware of any real solution to the issue. What I do instead is create a
short silent WAV file using Audacity (or [Tenacity], or [Sneedacity], or
whatever the currently popular fork is) and replace the offending sound files.
I have replaced `Sounds/LoveTheKing.wav` and everything under `Sounds/Ambience
Sfx`. There may be more files, I don't know, but I found this acceptable.


## Multiplayer

I haven't tried it, so no idea how well it works. I know there is an open bug
related to multiplayer, see below for the link.


## Links and references

### Useful resources

- [PC Gaming Wiki article on Civ3] contains generally useful technical
  information
- [WineHQ AppDB entry for Civ3] contains user feedback about the game running
  in Wine
- [CivFantatics downloads for Civ3] is hosting a number of useful files,
  including official patches

### Bug tickets

- [Black terrain bug on WineHQ]
- [Black terrain bug on Mesa]
- [Sound effect bug]
- [Multiplayer bug]


[Wine]: https://www.winehq.org/
[Void Linux]: https://voidlinux.org/
[website of PCGames]: https://www.pcgames.de/Civilization-3-Spiel-20090/News/Probleme-mit-Civ-3-Vollversion-Hier-gibts-Abhilfe-401682/
[bspwm]: https://github.com/baskerville/bspwm
[Tenacity]: https://tenacityaudio.org/
[Sneedacity]: https://github.com/Sneeds-Feed-and-Seed/sneedacity
[WineHQ AppDB entry for Civ3]: https://appdb.winehq.org/objectManager.php?sClass=application&iId=426
[PC Gaming Wiki article on Civ3]: https://www.pcgamingwiki.com/wiki/Civilization_III
[CivFantatics downloads for Civ3]: https://forums.civfanatics.com/resources/categories/civilization-iii-downloads.13/
[Black terrain bug on WineHQ]: https://bugs.winehq.org/show_bug.cgi?id=41930
[Black terrain bug on Mesa]: https://gitlab.freedesktop.org/mesa/mesa/-/issues/5094
[Sound effect bug]: https://bugs.winehq.org/show_bug.cgi?id=51502
[Multiplayer bug]: https://bugs.winehq.org/show_bug.cgi?id=17726
