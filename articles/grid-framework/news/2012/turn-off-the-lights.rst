:title: Turn off the lights!
:date: 2012-05-29
:tags: old-blog, example
:subsite: grid-framework

Here is a nice little puzzle game made using the grid framework. When you click
a square that square and the four adjacent squares flip their color. Your task
is to turn them all off.

.. figure:: {attach}./images/lights-out.png
   :alt: Screenshot from lights out game example

The entire game uses only two scripts with a total of 70 lines of code. Sure,
that may not seem like a small amount, but keep in mind that almost half of
that is just whitespace and comments for better readability. The other half is
mostly just to handle the user's input and only two lines are used for
grid-based operations, i. e. finding out which tiles to flip. What's even
better is that this works for any setup, you can even have holes and weird
apendages like in the above picture. You could even move tiles during gameplay
or generate the puzzle dynamically rather than by hand every time. Grid
framework always finds the right tiles for you.

I will put up a video tutorial eventually once the package is released. I used
delegates and events, so if you don't know what they are take a look at
prime31studios' video tutorial:

.. youtube:: N2zdwKIsXJs

