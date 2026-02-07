---
title: Generating Unity3D project files on GNU/Linux
category: misc
tags: linux, rant
---

When I develop [Grid Framework] I need Unity3D to generate project files for
[Omnisharp] to pick up in order to provide me with tooling like
auto-completion, linting and refactoring support. Normally doing so requires me
to have VSCode installed, but there is a simple way to trick Unity into
generating those files anyway.

We can generate the files by opening Unity's external tools settings (Edit →
Preferences → External Tools) and clicking the "Regenerate project files"
button. Here is the catch though: this button only appears if your external
script editor is VSCode (or some related editor). Unity only checks the name of
the binary, so all we need to do is provide another binary with the same name.

Create a shell script named `code` and save it somewhere. I put mine under
`~/.local/bin`. It has the following content:

```sh
#!/bin/sh
echo 'This is definitely VSCode. Trust me, I am an expert.'
```

The content does not really matter, the script will not get run anyway. You
might have to make it executable, but probably not. Anyway, that's it, now you
can switch back to using a proper text editor instead of a web browser
pretending to be an editor.


[Grid Framework]: /grid-framework/
[Omnisharp]: https://github.com/OmniSharp/omnisharp-roslyn
