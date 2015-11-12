:title: Happy new year
:date: 2013-01-01
:tags: old-blog, rant
:subsite: grid-framework

A happy new year to everyone! This has been quite a year for me, so what better
opportunity to recap the birth process and evolution of Grid and set the plans
for this year?


How it all began
----------------

One day I was sitting at my computer, trying to place blocks in Unity, thinking
how great it would be if there was some sort of extension, a framework if you
will, that would auto snap objects to a grid of my choice. Unity already has
some form of grid built in, but it's rather poor to say the least.
Unfortunately a quick Google search didn't yield anything useful, so was left
waiting for someone who knew how to program a copmputer to make such an
extension. Then it struck me: I am someone and I know how to program a
computer!


The first draft
---------------

So I sat down, took out some pen and paper and started deriving th formulae.
After a while I had a plan and I wrote a nice simple makeshift solution. It
worked but in my head all sorts of great ideas popped up. What if the grid was
in 3D and could be rotated? Would it be possible not to just align objects but
construct an entire coordinate system out of it? What if the origin of the grid
was not the origin of the world but any point in space? Would it be possible to
have more than one grid in the scene? How about entirely different grid shapes
than just squares? And if all that was possible, wouldn't be possible to use
the grid for more than just aliging? Could the grid be used for actual
gameplay?

The idea at the time was to get the makeshift solution polished up a bit and
then give it away for free and ask for a small donation or sell if really
cheaply. This idea was humble, if you want to be nice, or stupid, if you want
to be realistic. Essentially, it wouldn't have made any user happy nor would it
have made me money. No one would win. Fortunately the Asset Store submission
got lost somehow and remembering the awful drawings I had for the Asset Store
pictures, it really was for the best.


This Time For Real
------------------

The lesson I leared was that if you want to do something do it either right or
don't do it at all. People will remember a halfassed effort and you will never
be able to shake it off. Instead I decided to get serious this time, I switched
my language from JavaScript to C#, dug into the deepest depths of the Unity
documentation and learned many new things along the way. At times it was
infuriating, at times it was fantastic and at times it was plain boring.
Nonetheless, if I had the chance to travel back in time I wouldn't do anything
differently (except for some lessons I had to learn the hard way), the
experience alone of crafting something on your own and working towards a goal
is very rewarding. I don't think there was anything left from the first draft,
and even if it was it is all gone by now. Good riddance.

If it had been just the coding part it would have been enough already. Being a
one man team however, I also had to write the documentation, design a logo,
create the Asset Store promotional material and write descriptions for the
Store and the forum thread. I never learned anything about marketing, but I did
work in retail, this is where my exerience came in handy. On the internet I can
think all day about the description text, but when it comes to talking face to
face with real people your brain has to act very quickly.


The First Release
-----------------

If you were to ask me what the hardest part was, I would say finishing it.
There comes a point when you have to draw the line and stop adding new features
so you can iron out the remaining bugs and wrap up the lose ends. There were
still some left after the release though, mainly the integration into Unity's
interface, no cusom inspectors for the grid classes and the complete lack of
rendering. I decided to tackle those as quickly as possible, for I was running
out of time.


The 1.1.x Line
--------------

I had no idea how to do the rendering and at one point I was considering
imitating Vectrosity's behaviour (after asking for permission of course).
Anyone who owns Vectrosity and who has taken a look at the code will be blown
away by all the work of the author, there was no way I could just rip out some
parts and call it a day. Instead I decided to write my own rendering solution
and offer Vectrosity support as an option, since I already had a license and
the two looked like a perfect fit. Both solutions work in fundamentally
different ways, so users can choose the one they like best. Yay for choice ^^

After getting rendering, the biggest missing feature, and Vectrosity support
out I had two things to do: many small improvements like a custom rendering
range or additional functions and of course hex grids. This was during the
summer when I was busy studying for exams, so my work on Grid Framework slowed
down to a crawl after the first few 1.1.x releases.


Version 1.2.x and hex grids
---------------------------

After the exams I was finally able to devote time to Grid Framework again. The
hardest part about hex grids was not so much the math, although that wasn't
easy either, but how many possibilities there are to do hex grids. I already
discussed this topic a few months ago, but this was a real pain. It was clear I
wouldn't write several classes, so I had to design my code to accommodate for
all the cases. In the end the solution was not really hard, it was the journey
there, I just couldn't find anything on the internet or in any book about how
to do it. What really matters in the end though, is that I was able to deliver
one class for all cases, fitting right with my design principles established in
the first release.


The Future of Grid Framework
----------------------------

Well, that's it for last year, but what can you expect for 2013? First of all,
I'm working on my own website, so far it has only been this blog and the forum
thread, but I would like to give Grid Framework a proper web presence. I had to
learn HTML and CSS from scratch, but the site is almost done, just a few
finishing touches and it should be up soon.

Hex grids have the same feature set as rectangular grids, but there is more we
can do with them, most notably more coordinate systems. Expect more updates for
hex grids after the site has launched. There are also a few minor features I
would like to get done all across Grid Framework, so I'll add them inbetween
the more important releases.

Triangular grids and path finding are next on the priority list, I just haven't
decided which one would be more important. Triangular grids sound easier, but
path finding seems more useful. I'll have to think this over when the time
comes.

Well, that's it for this time. Have a good year 2013 and thank you all for your
support :)
