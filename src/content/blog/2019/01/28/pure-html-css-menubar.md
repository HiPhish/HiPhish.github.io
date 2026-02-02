---
title: A pure HTML & CSS menubar
category: organisation
tags: html
---

In the process of de-Bootstrapping the workshop I have to replace whole
components provided by [Bootstrap] with my own constructs. The menu bar is one
of the larger components I use, it's fairly complex and requires a lot of
non-semantic markup to get working. In this blog post I will describe step by
step how I built mine, which requires less markup and does not rely on
Javascript. You can try the [demo] to see what we are going for (please resize
your window to see the responsiveness).


## The plan

We want a link to the home page, followed by a list of menu items.  Each menu
item can either be a simple link, or it can contain a list of sub-menu items.
We also want the ability to split the menu items, that is some items will be
pushed to the end (right when horizontal, down when vertical).

On large screens we want to be able to see the entire navigation bar with both
levels of nesting, but on small screens we only want to display the link to the
home page and a hamburger menu button. Clicking the button will expand the menu
bar to show the first level of menu items, clicking it again will collapse it.

Everything needs to work without Javascript, so we will be using the [checkbox
hack]. This is a hack, so we will have to do some extra work to keep the hack
[hidden] from the user's view. This does not only apply to graphical web
browsers, but other user agents as well.


## The markup

The HTML code is fairly straight-forward. We start with a `nav` containing the
checkbox for our hack.

~~~html
<nav>
  <input type="checkbox" id="main-navbar-hambuger" hidden="hidden"/>
</nav>
~~~

The checkbox has the `hidden` attribute, this will hide it from all user
agents, we do not want the user to see this because it has no semantic purpose.

On small screens we want to show the link to the home page and the hamburger
button, so the two of them go together in a `div`.

~~~html
<nav>
  <input ... />
  <div>
    <a href="/">Home Page</a>
    <label for="main-navbar-hambuger" hidden="hidden"></label>
  </div>
</nav>
~~~

The home link is self-explanatory, but the `label` deserves some attention.
We hide it as well, because it only makes sense on graphical browsers, not on
other user agents. We will use CSS to override its `display` style, this way it
stays hidden in every user agent, except those that support CSS. Clicking the
label will toggle the checkbox, and we will be using the state of the checkbox
to toggle display of the menu items.

~~~html
<nav>
  <input ... />
  <div> ...  </div>
  <ul>
    <li>
      <a href="#">Item 1</a>
      <ul>
        <li><a href="#">Item 1.1</a></li>
        <li><a href="#">Item 1.2</a></li>
        <li><a href="#">Item 1.3</a></li>
        <li hidden="hidden"></li>
        <li><a href="#">Item 1.4</a></li>
      </ul>
    </li>
    <li>
      <a href="#">Item 2</a>
      <ul>
        <li><a href="#">Item 2.1</a></li>
        <li><a href="#">Item 2.2</a></li>
        <li><a href="#">Item 2.3</a></li>
        <li hidden="hidden"></li>
        <li><a href="#">Item 2.4</a></li>
      </ul>
    </li>
    <li><a href="#">Item 3</a></li>
    <li class="push-end"><a href="#">Item 4</a></li>
    <li><a href="#">Item 5</a></li>
  </ul>
</nav>
~~~

The menu items are contained in an unordered list as usual for menu bars. Each
list item is either just a plain hyperlink (no nesting), or a hyperlink
followed by a list of further menu items. One top-level menu item can carry the
`push-end` class, this item and its later siblings will be pushed towards the
end of the menu bar.

We also support separators in nested lists. A separator is an empty `li`, and
since it has no semantic meaning it is also `hidden`. As with the label, we
will use CSS to display it as a thin horizontal bar.


## The CSS styling

We have hidden all the hacky items, so on user agents which do not support CSS
we will get a nicely nested list of navigation menu items. For graphical web
browsers however we will need to apply some CSS polish to turn the lists into a
navigation bar.

~~~css
body > nav {
	display: flex;
	flex-flow: row wrap;
}

body > nav a {
	display: block;
}
~~~

The main display mode will be flexbox, it allows the browser to figure out how
to space things on its own. Recall that the toplevel `nav` has only two
elements: the `div` containing the home link and the hamburger button, and the
list of menu items (the checkbox is technically also there, but it's hidden, so
we will pretend it does not exists). We space them at the beginning (left) with
flexbox and display all hyperlinks as blocks. The list of items will be allowed
to grow, that way it will push the home link all the way to the start and take
up the remaining space.

~~~css
body > nav > div {
	display: flex;
	flex-flow: row wrap;
	justify-content: space-between;
}

body > nav > div > label {
	display: none;
	border: 1px #1a242f solid;
}
body > nav > div > label::after {
	content: "☰"  /* Trigram for Heaven */
}
~~~

The `div` is also a flexbox container, and we space its items as far apart as
possible. This does not matter for now, but it will when we make the label
visible. Finally, note that in the markup we had left the content of the label
empty. We add it in with CSS here because there are still some user agents
which do no respect the `hidden` attribute (such as [Lynx]), and I want to
avoid confusing their users with a Chinese glyph out of nowhere in the header
of the page.

~~~css
body > nav > ul {
	display: flex;
	flex-direction: row;
	flex-grow: 2;  /* Allows growth of the ul inside the nav */
}

body > nav > ul > li > ul {
	display: none;
	z-index: 1;
	position: absolute;
}
~~~

Finally, we style the lists. Setting the `flex-grow` allows the list to grow to
the full width inside its parent container. The second level will be hidden
from sight for now.


### Large screens

On large screens we display the second level when hovering on top of the parent
list, we implement the `.push-end` class and override the display of the
separators.

~~~css
@media(min-width: 769px) {
	body > nav > ul > li.push-end {
		margin-left: auto;
	}

	body > nav > ul > li:hover > ul {
		display: block;
	}

	body > nav > ul > li:hover > ul > li[hidden] {  /* Separator */
		display:block;
		height: 1px;
		margin: 0.5em 0;
		background-color: red;
	}
}
~~~


### Small screens

Now it really pays off that we are using flexbox: re-arranging items can be
done by just overriding the flexbox properties. We also override the `display`
of hidden items to make the label visible. The first level list is now hidden,
*unless* its previous `input` sibling is checked. How do we check an invisible
checkbox?  By clicking the (now displayed) label. Clicking the label has the
same effect as clicking the checkbox, thus turning the label effectively into a
button.  This is the checkbox hack.

~~~css
@media(max-width: 768px) {  /* Mobile-sized screens (phones, tablets) */
	body > nav {
		flex-direction:	column;
		align-items: stretch;
	}

	body > nav > div > label {
		display: block;  /* Override the default for hidden */
	}

	body > nav > ul {
		display: none;
		flex-direction: column;
	}

	body > nav > ul > li.push-end {
		margin-top: 1.0em;
	}

	body > nav > input#main-navbar-hambuger:checked ~ ul{
		display: flex;
	}
}
~~~


## Conclusion

The checkbox hack is ugly, but it is still the least harmful way of
implementing a responsive menu bar which works on all devices and user agents.
Care must be taken to hide the hack from users and maintain clarity. This menu
bar is still not the ultimate possible menu bar, there are a couple of things I
would wish for:

- The second level can only be displayed by hovering, I would prefer if it was
	possible to toggle display by clicking or touching.
- This also means that accessing the second level is impossible on
	touch-devices. The first-level links must be so that all content is still
	reachable, even if not as conveniently.
- The checkbox requires an `id` attribute. This is not a big issue, but it
	would be nicer if it did not.

All of these could be accomplished in Javascript, but I would rather not use it
if there is a better way. The first two points are possible using the checkbox
hack and radio buttons, but it would require much more hackery. Another day
perhaps. The third point would probably be possible by using the CSS `:has()`
selector, but it is not yet implemented in any web browser. Oh well, I cannot
let perfect be the enemy of good, and this is still better than what I had
before.


[Bootstrap]: https://getbootstrap.com/
[demo]: demo.html
[checkbox hack]: https://css-tricks.com/the-checkbox-hack/
[hidden]: https://www.w3.org/TR/html51/editing.html#the-hidden-attribute
[Lynx]: https://lynx.invisible-island.net/
