---
title: Separation of content and presentation in Tailwind
category: misc
tags: [web, css]
---

Every [Tailwind] example I have ever seen uses inline styling by applying
Tailwind utility classes directly to the element.  Even the Tailwind website
advertises this feature.  It was what kept me from trying out Tailwind for
years.  Eventually I decided to at least give it a try, and I found out that
you can indeed separate your presentation from the content with Tailwind.


## The `@apply` directive

There is a global CSS file (usually named `global.css`) which contains all the
Tailwind configuration.  Tailwind's CSS is a superset of regular CSS and adds a
number of extra [functions and directives].  Among them is the [`@apply`
directive] which effectively applies the listed utility classes to the selector
is in.  You can give it any number of utility classes and even mix in regular
CSS.  Here is an example:

```css
@import 'tailwindcss';

p {
	@apply text-justify;
	@apply bg-slate-300 dark:bg-slate-800;  /* Second rule just for colors */
	display: block;  /* regular CSS */
}
```

This is equivalent to writing:

```css
p {
	text-align: justify;
	background-color: var(--color-slate-300);
	@media (prefers-color-scheme: dark) {
		background-color: var(--color-slate-800);
	}
	display: block;
}
```

The Tailwind `@apply` directive is different from the proposed CSS [`@apply`
rule] which has since been abandoned.  This is strictly a Tailwind thing now.


## Why you might like this

Adding utility classes directly to HTML elements is inline styling.  In my
above example every paragraph will be styled the same, unless some more
specific selector overrides any of the properties.  I also find it much easier
to read the markup without fifty utility classes peppered into the `<div>`
soup.  Yes, I know there are editor plugins which hide the classes visually,
but they are still there in your diff and when you need to change one of them.

Another reason I like it is because I can style all the built-in HTML elements.
The above CSS applies to all paragraphs, regardless of whether I write them by
hand or they are generated from a Markdown file.  People recommend wrapping
primitives with custom components like this:

```jsx
const Pragraph = ({children}) => {
    return (
        <p className="text-justify bg-slate-300 dark:bg-slate-800">
            {children}
        </p>);
};
```

OK, but now you have to remember to use your custom component.  If you use a
library or framework to generate HTML you need to get it somehow to use your
custom components instead of standard HTML.  And of course this only works if
you are using a component framework in the first place.


## Why you might not like this

The only downside I can think of is that you have to deal with the CSS cascade.
Inline styling avoids the cascade, so you never have to think about it.  I'd
say that's a skill issue though.


## Why not both?

You can mix both of these approaches.  I think inline styling is appropriate
for one-off uses and for rapid prototyping.  I can iterate quickly by adding a
few classes and then when I like what I'm seeing I can move them to a proper
CSS file.



[Tailwind]: https://tailwindcss.com/
[functions and directives]: https://tailwindcss.com/docs/functions-and-directives#apply-directive
[`@apply` directive]: https://tailwindcss.com/docs/functions-and-directives#apply-directive
[`@apply` rule]: https://tabatkins.github.io/specs/css-apply-rule/
