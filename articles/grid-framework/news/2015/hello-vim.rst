:title: Goodbye MonoDevelop, hello Vim
:date: 2015-01-09
:tags: old-blog, rant
:subsite: grid-framework

One thing that has been getting on my nerves ever since I started working with
Unity has been MonoDevelop. While it is a good IDE for the most part it
suffered from a number of annoying issues, such as folds randomly opening, poor
performance, and auto completion randomly not working. Your mileage may vary,
and for the most parts it was doing its job, but the annoying hiccups kept
happening all the time.

I tried out the official Xamarin Studio, but that one didn't fare better and on
top of that always threw up error messages when opening a file. I was looking
into alternate editors, but they didn't offer the rich C#-focused feature set
of MonoDevelop, so I was stuck with it.

Eventually I was so fed up, I decided to go all the way back: no fancy IDEs, no
GUIs, back to to bare basics: Vim. The cool thing about Vim is that's it's a
very simple barebones editor that can be extended and customised to your
liking. Vanilla Vim is nice, but you have not really used Vim until you have
tailored every aspect to your personal liking. That's a gradual process that
will take years of experience, but I do already feel very comfortable outside
of the hand-holding restrictions of the IDE.

For an ideal Unity setup you will want a GUI client of Vim, such as MacVim.
That doesn't mean that Vim will get all those fancy buttons and menus, although
you can enable those if you want to, but the main advantage is that it can be
launched like any other application instead of through the terminal. MacVim has
also better mouse support (it's faster to resize windows with the mouse) and
the character cursor looks different in insert mode.

The next thing you want is support for .Net and C# features. The plugin for
that is Omnisharp:

`https://github.com/OmniSharp/omnisharp-vim <https://github.com/OmniSharp/omnisharp-vim>`_

Omnisharp will add pretty much all features that you have come to love from
MonoDevelop, without the headache. Omnisharp also provides an interface for
other plugins, for example you can use it with YouCompleteMe to get automatic
code-completion:

`https://github.com/Valloric/YouCompleteMe <https://github.com/Valloric/YouCompleteMe>`_

There is a ton of other useful plugins out there as well and some are listed on
Omnisharp's page. Another advantage of Vim is that it's not restricted to one
particular language or framework. You can easily write your essay or design
your HTML web page in it. Customisations can be set for each file type
differently or you can use them over multiple types. Since it's all one editor
you don't have to learn a new IDE for every project.

In fact, I have been designing my new upcoming website in Vim as well, the same
editor I use for writing Grid Framework. How cool is that? Here is a video I
found on YouTube of someone using Vim to edit text with the speed of though:

.. youtube:: lQNFfhC4QI8
