title: Documentation dilemma solved
category: progress
---


I have finished the build system,  which also includes the previously discussed
documentation dilemma.  The problem was the presence of actual JavaScript files
which Unity kept confusing for UnityScript files, because Unity keeps referring
to UnityScript as JavaScript.


The build system
----------------

When you purchase  Grid Framework from the  Asset Store you get the full source
code instead of a DLL,  but I still have to package everything in a format that
is suitable for distribution.  First I need a  new blank Unity project,  then I
import the assets to  publish into the project,  then I import the  Asset Store
tools and finally I upload it.

In the very early  days I was doing it all by hand,  but it goes without saying
that it was a very tedious and error-prone process.  Some way of automation was
needed.  Unity can  be operated  from the  command line  and since  I'm  a Unix
programmer I was already familiar with Make.

The Make process is as follows:

1) I have  a Unity  project where all  the work happens,  so I launch  Unity in
   command-line mode and export all the relevant files as a Unity package.
2) The documentation is build from  the source and separately maintained manual
   pages.
3) A new Unity  project is  created in  command-line  mode and  the package  is
   imported.  Afterwards  the  previously   built  documentation  is  imported,
   followed by the Asset Store tools.

At this point  I have a  fresh Unity project  ready for shipping.  All  this is
executed  by  typing `make publish`  in  my shell.  The only  way to  make this
process even easier would  be to bind this to  a key in Vim, but I'm not *that*
lazy ;)


The documentation dilemma
-------------------------

In version  1.x my  solution  to  the documentation  dilemma was  to abuse  the
*WebPlayerTemplates* directory.  UnityScript files  in that  directory  will be
ignored by  the compiler,  thus my JavaScript files were safe there.  Of course
this is not what  that directory is for and  some people did not like how I was
taking over  a directory  they needed.  The band-aid  solution was  to host the
documentation online so people could delete their local copy.

I have now solved the problem in a way that will satisfy everyone. The trick is
that JavaScript  files do not actually  have to end in `.js`,  you just have to
tell the browser  what they are.  If I was writing  my own HTML  and JavaScript
this would be  the end of the story,  but I use Doxygen  to generate it  for me
instead and Doxygen names JavaScript files such that they end in `.js`.

How can we fix this?  We would have to rename every JavaScript file and then go
through every  single HTML  and JavaScript  file and  change all  references to
JavaScript files accordingly.  This whole process would have to be automated so
we can carry it out right after generating the documentation.

One of the Unix philosophies is to have many small programs that carry out very
specific and specialised  tasks and then glue  them together through scripting.
We can perform all the above steps using a `for` loop, `find`, `mv` and `sed`.

First we need  to find all the files  we are looking for.  The first time these
are just JavaScript  files and the second time  around it's HTML and JavaScript
files.

~~~sh
# Find all JavaScript files
find ./build/documentation/html/ -type f -name '*.js'

# Find all HTML and JavaScript files (JS files after being renamed)
find ./build/documentation/html/ -type f -name '*.js.txt' \
        -or -name '*.html'JavaScript files
~~~

These two  lines would  just list  the files,  but  we  don't want  files names
printed to  the terminal,  we want  to loop  over them.  Wrapping a  command in
backticks replaces their content with the output of the command.  Let's use the
output in a `for` loop.

~~~sh
# I'm only showing the first one here
for f in `find ./build/documentation/html/ -type f -name '*.js'`; do
~~~

Inside the loop we can use the variable `$f` to reference the current file. The
renaming process is very simple,  we just append `.txt` to the file name;  this
way `navtree.js` becomes `navtree.js.txt` for example.

~~~sh
# The file extension doesn't really matter, but everyone knows what a text
# file is, so I might as well use that.
mv $f $f.txt
~~~

Now for the harder part:  we have to  go through the contents  of all files and
change any reference to a file ending in `.js` to the same,  except with `.txt`
appended.  The program `sed` can do this;  `sed` stands for *Stream Editor* and
it can edit text files automatically based on commands passed to it.

~~~sh
# '-E' means using modern regex, '-i "" ' means in-place overwriting
sed -E -i "" 's/([_a-zA-Z0-9]*)\.js/\1.js.txt/' $f
~~~

`sed`  finds  the  parts  we  want  to  replace  using the  regular  expression
`([_a-zA-Z0-9]*)\.js`  and then replaces the match  with the file name followed
by `.js.txt`  using `\1.js.txt`  (the `\1` stands for the  match of the braces,
which is the file name in practice).

And that's essentially it.  All that is left now is  writing it on one line and
escaping the dollar signs for Make.  This solution makes it possible to include
the full documentation  working out of the box  from any directory.  Now all of
Grid Framework  can be  placed  in a  single  subdirectory of  *Plugins*.  Once
version 2  gets published  I will  update version  1 to  not use  the old  hack
anymore.
