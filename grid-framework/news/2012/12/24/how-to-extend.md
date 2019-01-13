title: How to extend Grid Framework with your own methods
category: tips
tags: old-blog, extension
subsite: grid-framework
---

Let's say you just bought Grid Framework, wrote some game logic and now you
want to reuse it. Wouldn't it be great if it was a class method in Grid
Framework so you could simply call it with one line of code? Even better, what
if you could have one method that has the same syntax for both rectangular and
hexagonal grids but different implementation based on the type of grid, so you
would have to write just one script for any type of grid? Luckily this is no
problem in Unity thanks to extension methods and if you have the code, then
wrapping it up into an extension method can de done in a few minutes. Take a
look at my latest video tutorial:

https://www.youtube.com/watch?v=W_QteDtqHK4

Extension methods are only available in C#, but once you've written the method
you can use it in any of Unity's scripting languages. Aside from keeping your
code cleaner, extension methods have the advantage that if you need to make
adjustments to your game logic you only need to do it in one place and every
call of the method benefits from it.

