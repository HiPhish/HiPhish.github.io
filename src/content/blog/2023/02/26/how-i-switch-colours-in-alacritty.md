---
title: How I switch colours in Alacritty
category: open-source
tags: linux, terminal
---

My current terminal emulator is [Alacritty].  One thing I would like is a way
to change the colours while the terminal is running.  The only way to do so is
the edit the configuration file, but doing so by hand can be annoying.  There
are some scripts out there that let you do it automatically, but all that I
have found rely on bloated stuff like having [Node.js] installed.  We can do
better by using just what we already have on Unix out of the box.

The end goal is a script `alacritty-theme` which will present a menu of
predefined themes and apply the selection.  We need the following prerequisite
knowledge and tools:

- Unix shell scripting
- Some selection program like [fzf], [dmenu] or [rofi]
- `ed`, the original Unix text editor

That's right, where we're going we won't need any fancy GUIs and TUIs.  It's
1970s teletypes all over again!


## The plan

Alacritty is configured through a [YAML] file named `alacritty.yml`.  YAML by
itself has no “include” mechanism that would allow us to splice in the content
of another YAML file, but Alacritty implements such feature through the
`import` key.  The value is a list of file paths to files whose contents will
be read in.

This lets us move the theme into a separate file like
`theme/solarized-dark.yml` which we then reference in the main configuration
file.  Here is an example configuration file:

```yaml
import:
  - '~/.config/alacritty/themes/solarized-dark.yaml'

window:
  padding:
    x: 1
    y: 1
  dynamic_padding: true
  opacity: 0.9

font:
  size: 9
  normal:
    family: monospace
```

The plan is as follows:

- Find that line
- Replace the file name portion with the name of theme
- Save the changes


## The execution

### Editing the config file

We will start with the hardest and most important part: applying the theme.
Let us for now pretend that we already have the name of the theme.  We have to
execute the following steps:

1) Open the config file
2) Find the line which sets the theme
3) Substitute the name of the theme
4) Save the changes

First we have to open the file.  We use `ed` as our editor, so we give the file
name as the argument to the command.

```sh
ed alacritty.yml
```

This will put us in the interactive ed prompt.  Ed is a command-based text
editor, we type an instruction on what to do and ed carries it out.  It is like
editing a text file blindly, which is perfect for later when we want to
automate the entire process.

Now let us find the line of interest.  To find a line we can use the `/`
command followed by a regular expression.

```
/^  - '.*\/alacritty\/themes\/.*[.]yaml'$
```

Note that we are including the leading whitespace and the dash as well.  We
also assume that there are no trailing comments or trailing whitespace.  This
reduces the likelihood of a false positive match.  Now we have to apply the
substitution using the `s` command.


```
s/[^/]*[.]yaml'$/solarized-light.yaml'/
```

The `s` command's syntax is `s/regex/substitute/` where `regex` is a regular
expression to match and `substitute` is the new text.  The separator `/` can be
any other character in case we want to use `/` inside the regular expression.

All that is left now is to save the changes and exit the editor using the `wq`
command.  Insert joke about exiting ed here.

```
wq
```

We can automate the entire process.  Ed reads commands from the standard input,
so we provide them line by line as a here-document.

```sh
# The $theme variable holds the name of the theme
ed alacritty.yml <<- EOF
    /  - '.*\/alacritty\/themes\/.*[.]yaml'
    s/[^/]*[.]yaml'$/${theme}.yaml'/
    wq
EOF
```

### Selecting a theme

All themes are YAML files inside the `themes` directory of the Alacritty
configuration directory.  Here is how to list them:

```sh
# The configuration directory depends on the environment
config_dir="${XDG_CONFIG_HOME:-${HOME}/.config}/alacritty"

# Get all files, pick only those with 'yaml' as extension, strip extension
ls ${config_dir}/themes | grep '\.yaml$' | sed 's/\.yaml$//'
```

This is slightly fragile because a file name might contain newline characters,
so please don't do that.  At this point we have many options for how to select
a theme.  I like to use a fuzzy finder, so I will pipe the list into rofi and
store the result in a variable.

```sh
theme=$(ls ${config_dir}/themes | grep '\.yaml$' | sed 's/\.yaml$//' | rofi -dmenu)
```

## Putting it all together

Here is a complete shell script:

```sh
#!/bin/sh
set -e

config_dir="${XDG_CONFIG_HOME:-${HOME}/.config}/alacritty"
theme=$(ls ${config_dir}/themes | grep '\.yaml$' | sed 's/\.yaml$//' | rofi -dmenu)
ed  "${config_dir}/alacritty.yml" <<- EOF
    /  - '.*\/alacritty\/themes\/.*[.]yaml'
    s/[^/]*[.]yaml'$/${theme}.yaml'/
    wq
EOF
```

Here are a couple of ideas for improvement:

- If the script is called with an argument use that argument as the name of the
  theme
- Display an error message if the theme does not exist and exit with an error
- Handle the argument `-h` or `--help` to display a help message
- Make the fuzzy finder configurable
- Fall back to a different selection mechanism if the fuzzy finder is not
  available
- Send the standard output of `ed` to `/dev/null` to silence the script


## Conclusion

A small shell script gets the job done, but there a few issues.  For starters,
editing a structured file blindly through regular expressions can be fragile.
With a proper YAML parser we could understand the structure of the file and
make precise edits.  It does not really matter in something this simple, but it
is worth keeping in mind for the next time we try to automate text editing with
ed.  In the opening paragraph I called those other scripts bloated and I stand
by what I said, but only because this particular case does not warrant the
effort.

### A better solution

The other issue is that we are editing a configuration file.  If the
configuration is under version control it will now be marked as edited.  There
is nothing that can be done, this is simply a limitation of Alacritty.  The
closest to a solution is to have an extra file `theme.yaml` in-between and have
version control ignore it.  The config file first imports the default theme and
then imports the `theme.yaml` file:

```sh
import:
  - '~/.config/alacritty/themes/solarized-dark.yaml'
  - '~/.config/alacritty/theme.yaml'
````

The `theme.yaml` file then imports the actual theme we want to use:

```sh
import:
  - '~/.config/alacritty/themes/solarized-light.yaml'
````

Alacritty will ignore missing files on import, so if the theme file does not
exist nothing happens.  Thus instead of editing the main config file we can
simply write a new theme file from scratch with the name of theme spliced in.
Then all we have to do is use `touch` to update the modification time of the
main config file (without any actual changes) so Alacritty knows to source it
again.  Alacritty only tracks the main config file, but none of the imported
files.  Here is the complete script:

```sh
#!/bin/sh
set -e

config_dir="${XDG_CONFIG_HOME:-${HOME}/.config}/alacritty"
theme=$(ls ${config_dir}/themes | grep '\.yaml$' | sed 's/\.yaml$//' | rofi -dmenu)

cat << EOF > "${config_dir}/theme.yaml"
import:
  - '${config_dir}/themes/${theme}.yaml'
EOF
touch "${config_dir}/alacritty.yml"
```

Actually, we did not need ed after all.  Oops.  Well, I guess we all learned
something in the process at least.

[Alacritty]: https://alacritty.org/
[Node.js]: https://nodejs.org/en/
[fzf]: https://github.com/junegunn/fzf
[dmenu]: https://tools.suckless.org/dmenu/
[rofi]: https://davatorium.github.io/rofi/
[YAML]: https://yaml.org/
