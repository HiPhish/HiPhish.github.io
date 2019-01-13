title: Grid Framework version 1.4.1 released
tags: old-blog, extension
category: release
---

Actually it has been up for almost a month already, but I have been busy.
Anyway, this is the long-awaited release that brings PlayMaker support to Grid
Framework, so here is the change log:

- Introducing Playmaker support: Almost the entire Grid Framework API can no be
	used as Playmaker actions (some parts of the API are outside the capabilities
	of Playmaker for now)
- Updated the documentation to include a chapter about Playmaker and how to
	write your own Grid Framework actions.
- Fixed: the origin offset resetting every time after exiting play mode.
- Fixed compilation error in one of the Playmaker actions (setter and getter
	for depth of layered grids) 

If you're wondering why I skipped 1.4.0, it's because I discovered a bug right
after submission, so I submitted 1.4.1 right afterwards, thus skipping over the
release of 1.4.0. As always you can read about how to use the new PlayMaker
actions or write your own ones  in the documentation.

As for future plans for Grid Framework, I still have a place that I want to
optimise before considering new features, and it will require a good amount of
digging, but the result will be cleaner and easier to maintain code.
