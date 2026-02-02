---
title: A file system abstraction for HSSG
category: open-source
tags: lisp, html, web
---

A while ago I announced my new pet project [HSSG], the hackable static site
generator.  The final step of generating a web site is writing the actual files
to the file system of the operating system.  So far this has been a messy
affair where information about file paths had to be dragged through the entire
chain from start to finish.  This was ugly, hard to maintain and it muddied the
layers of abstraction.  In this post I will explain how I brought order to HSSG
through a file system abstraction.

1) [The problem](#The%20problem)
1) [Dependency injection](#Dependency%20injection)
1) [Against dependency injection](#Against%20dependency%20injection)
1) [File systems and instructions](#File%20systems%20and%20instructions)
   1) [Deriving artifacts](#Deriving%20artifacts)
   1) [Interpreting instructions](#Interpreting%20instructions)
   1) [The m × n problem](#The%20m%20×%20n%20problem)
   1) [Testing](#Testing)
   1) [A deeper structure?](#A%20deeper%20structure%3F)
1) [Conclusion](#Conclusion)


## The problem

Suppose we want to produce the file `output/about/javascript/index.html` from a
file `content/about/javascript/index.html.md`. We have to perform the following
steps in this order:

1) Read in the Markdown file
1) Parse it into a tree of S-XML expressions
1) Pass it through a template to produce the content tree of the final HTML
   file
1) Create an artifact object
1) Output the HTML file

This final step requires information on where to write the output file to.  In
the above example the Markdown file and the HTML file share the same file path
except for the first directory, but this is just the way our imaginary project
is set up.  HSSG does not enforce any directory structure for the project on
purpose.  In the case of a blog enforcing a directory structure would not even
make sense because some pages, such as a category index page, have no
corresponding Markdown file at all, they are generated completely from
collected metadata.

This means that we have to drag along the pathname of the output file
throughout the lifetime of the artifact object.  For a simple case where we
convert a Markdown file to HTML this is not particularly bad, we only need to
add that information at step 4 and use it at step 5.  But what about more
complicated cases like a blog?  A blog artifact is a compound artifact which
contains many other artifacts which will be instantiated at different points in
time.  So we need to inject the path of the blog into the blog artifact, which
then injects new paths based on its path into the child artifacts.  You can see
how this becomes a mess quickly for complex artifacts.


## Dependency injection

The usual solution to abstraction and management of dependencies in
object-oriented programming is dependency injection.  I intentionally did not
want to use dependency injection, but I want to present here how I could have
done it.  It will help understand the solution I did go for instead.

The idea of dependency injection is to invert the relationship of dependency
and dependant.  What does this mean?  Let's say we want to produce an artifact.
In the interest of separation of concerns we need two objects:

- the artifact to produce HTML text from an in-memory tree
- some sort of “file system” object to write the HTML text to a file

Without dependency injection we would instantiate the artifact, which in turn
would instantiate its file system.  The file system is a dependency of the
artifact because the artifact needs it to do its job of being produced.

~~~lisp
;; This is a hypothetical example
(defun make-html-artifact (data out)
  (let ((file-system (make-static-file-filesystem out)))
    (make-instance 'html-artifact :data data :file-system file-system)))

(defun write-html-artifact (artifact)
  (let ((file-system  (artifact-file-system artifact))
        (content      (artifact-content artifact)))
    (write-content file-system content)))
~~~

Now the artifact is strongly coupled to the file system.  Suppose we wanted to
upload the artifact to a server over FTP, we would now have to change the
implementation of `MAKE-HTML-ARTIFACT` to instantiate a different type of file
system.  It also makes the code harder to test because the artifact can only
write to the underlying OS file system, unless we change the implementation
during the test (which we can do in Common Lisp), but then we are not testing
the code that will be actually running in production.

Dependency injection is the practice of creating dependencies before-hand and
then passing them as arguments to the constructor, i.e. injecting them.  Here
is the example from above with dependency injection:

~~~lisp
;; This is a hypothetical example
(defun make-html-artifact (data file-system)
  (make-instance 'html-artifact :data data :file-system file-system))
~~~

Note how we only changed the constructor, the implementation of
`WRITE-HTML-ARTIFACT` remains the same.  Now we can inject any kind of file
system object without having to change the implementation of the artifact.
Here are some examples:

- A file system which writes to the file system of the host OS
- A file system which uploads files over FTP to a server
- A compound file system which wraps the two file systems above to both write a
  local file and upload a copy to a server
- A file system which is relative to another file system
- A fake file system to assert that the right content would have been written
  during testing

The last one is particularly worth pointing out.  We can now easily test the
exact same code that will run during production.  The “H” in HSSG stands for
“Hackable”, so I cannot make any assumptions on what kind of file system
abstractions users will want to implement.

This is not some speculative “what if...” thought experiment, we can make heavy
use of file system abstractions in the official blogging plugin.  The blog
itself has its own file system, which is provided by the user.  Then internally
we use this file system as a basis for the file systems for the individual
pages of the blog.  Consider the aforementioned category index page which will
be written to `categories/<category>/index.html` (where `<category>` is the
name of the category), relative to the directory of the blog itself: the file
system is a wrapper around the file system of the blog.  Whatever the path of
the blog, we append the path of the file to that path.  Whatever the
implementation of the blog file system does (write to local FS, upload over
FTP, etc.), our wrapper file system does it as well.


## Against dependency injection

If dependency injection is so great, why not use it?  To be honest, I do not
have a good answer, other than that it feels wrong.  Ultimately we have not
changed much, artifacts still need to be concerned with writing themselves.
Artifacts still need to know their destination path.  All we have done is kick
the can further down the road.  And finally, it lacks any mathematical sense of
structure, we are just plugging together objects.


## File systems and instructions

If we want to have true separation between artifacts and file systems we need a
new type of object in-between.  Enter file system instructions.  Now a file
system becomes an interpreter for an instruction.  The instructions carries
information on *what* to do, while the file system is the interpreter which
implements *how* to do it.  Thus we have three actors:

- The artifact
- The instruction which is produced by deriving the artifact
- The file system which interprets the instruction

Writing an artifact is now a simple function call:

```lisp
(defun write-artifact (artifact file-system) 
  (let ((instruction (derive-artifact artifact)))
    (write-to-filesystem instruction file-system)))
```

### Deriving artifacts

The artifact protocol defines the generic function `DERIVE-ARTIFACT` which each
artifact class implements differently.  Here are some examples:

- An HTML artifact generates the HTML string content and creates an instruction
  for writing the string to a file.
- A file copy artifact creates an instruction for copying an existing file
- A compound artifact creates a compound instruction which contains the
  instructions produced from deriving the wrapped artifacts

This is what deriving an HTML artifact looks like:

```lisp
(defmethod hssg.artifact:derive-artifact ((artifact hssg.artifact:html-artifact))
  (with-slots ((data hssg.artifact::data)
               (template hssg.artifact::template)
               (output hssg.artifact::output))
      artifact
    (let* ((plump:*tag-dispatchers* plump:*xml-tags*)
           (contents (plump:serialize
                       (sexp->plump-tree (cdr (assoc :content (funcall template data))))
                       nil)))
      (make-instance 'hssg.filesystem:write-string-contents
      :contents (format nil "<!DOCTYPE html>~%~A" contents)
      :path output))))
```

Most of the code is about turning the S-XML tree into a string.  The interesing
part is the call to `MAKE-INSTANCE` where we create a `WRITE-STRING-CONTENTS`
instruction which writes the HTML text to a file.  We still need to have *some*
file path information in the artifact, but this information is decoupled from
the file system.  Usually it will be just the string `index.html` and we will
let the file system interpret where to place this file.


### Interpreting instructions

Here is where it gets interesting: the generic function `WRITE-TO-FILESYSTEM`
dispatches on both the file system *and* the instruction.  This allows us to
implement any behaviour we want.  Here is an example:

```lisp
(defmethod write-to-filesystem ((instruction write-string-contents)
                                (file-system base-file-system))
  (let ((path (fad:merge-pathnames-as-file
                (fad:pathname-as-directory (file-system-directory file-system))
                (instruction-path instruction))))
    (with-slots (contents) instruction
      (write-string-to-file contents path))))
```

We take the file path of the file system (usually the target directory), merge
it with the file path of the instruction (usually a file name like
`index.html`) and write the string contents to that file.  This is a very
primitive combination of file system and instruction, it does not get any
lower-level than this.  If we wanted to upload a file via FTP to a server we
would need a different implementation that dispatches on the type of the two
arguments.


### The m × n problem

At this point you might see a problem: if we have `n` file system types and `m`
instruction types, then we need `m * n` implementations.  To make matters
worse, if the user adds a custom file system he would need to implement
`WRITE-TO-FILESYSTEM` for each of the possible instructions.  What if two
different independent plugins add a new file system and a new instruction each,
do we now need to coordinate between complete strangers?  Do we have to
implement all those gaps ourselves?

Fortunately the answer is no.  The trick lies in realising that some file
systems and instructions are at a higher level (for lack of a better term) than
others.  They decompose into more primitive variants.  Let's look at two
examples.


#### Relative file system

A relative file system is a file system that sits relative on top of another
one.  The output directory (`output/`) of our website is represented by a
primitive `BASE-FILE-SYSTEM`, and the file system of the blog is a relative
file system which represents the path of the blog *relative* to the output
directory (`blog/`).  Writing to a relative file system is the same as writing
to a base file system which is a combination of the absolute path of the
original base file system plus the relative path (`content/blog/`).

```lisp
(defmethod write-to-filesystem (instruction
                                (file-system relative-file-system))
  (let ((directory (file-system-path file-system)))
    (write-to-filesystem
      instruction
      (make-instance 'base-file-system :directory directory))))
```

Note how we are not dispatching on the type of the instruction.  We do not care
about the instruction at this point.  We reduce the relative file system to a
new absolute one and then dispatch again on the two arguments.  The
implementation for the base file system can then decide on whether it cares
about the type of the instruction.

Thus we only needed to add one implementation to cover every possible type of
instruction in our new file system.


#### Compound instructions

A compound instruction is a wrapper around several other instructions.
Deriving a blog artifact is a good example: the blog itself is a collection of
multiple components, such as posts, indexes or archives, each of which can also
be a collection and so on until we are left with a lot of low-level HTML
artifacts. Deriving a blog artifact produces a compound instruction which wraps
a number of other instructions.


```lisp
(defmethod write-to-filesystem ((instruction compound-instruction)
                                file-system)
  (with-slots (instructions) instruction
    (dolist (instruction instructions)
      (write-to-filesystem instruction file-system))))
```

We loop over all the wrapped instructions then write them to the same file
system.  We do not care about the type of file system at this point, we pass it
on as it is and let the downstream call handle it.


### Testing

Testing is much simpler now.  With dependency injection we need to define a
fake file system class, instantiate it, inject it into the test subject,
perform the method call and then inspect the fake.  With instructions we just
derive the artifact normally and inspect the instruction that was produced.  No
need for mocks and fakes.

Testing file systems is still hard because at some point we do have to test
that the correct content is written to disc.  There is simply no way around
that.  We test each of the method implementations of `WRITE-TO-FILESYSTEM` in
isolation.

I consider it still a win though.  Testing artifacts is much simpler now. On
the other hand, we have to test file systems and instructions in combination
for side effects anyway, so that part has not gotten any more complex.


### A deeper structure?

There are primitive instructions, there are higher-level instructions which are
composed of other instructions, there are functions which operate on
instructions.  All this is hinting at an underlying algebraic structure.  I
have not investigated this matter, but if my hunch is correct and there indeed
is an underlying algebraic structure, then we could even apply formal reasoning
to investigate the possibilities and limits of the file system abstraction.
This is definitely something worth looking into in the future.


## Conclusion

The main selling point of HSSG is its hackability, and as the author of HSSG I
cannot know in advance how users want to produce output files.  Therefore I
need to separate the concept of an artifact (HTML page, static file, directory,
a collection of the aforementioned) from the act of producing output (writing
to the host OS file system, uploading files to a server).  A file system
abstraction allows me to keep the two concepts separate.

Instead of the customary dependency injection which produces loose coupling I
opted for an interpreter pattern in which there is no coupling at all.  An
artifact is derived to produce an instruction object.  This instruction
describes what action to perform.  A generic function is then applied to the
instruction and a file system object to actually produce the output.

Using multiple dispatch from CLOS allows me to keep these implementations
compact and easy to reason about.  Very primitive combinations of instruction
and file system are implemented in a few lines of code.  More higher-level
combinations can be expressed in terms of more primitive ones; these
implementations only need to dispatch on the type of one argument.  This keeps
the number of implementations bounded by O(n + m) rather than exploding to O(n
× m).

Testing is much simpler because we have no need for mocks and fakes.  Since
there are no dependencies to inject into the artifact we can simply derive it
and inspect the resulting instruction.  Deriving an artifact is thus a pure
function.  Side effects are moved to the outer-most fringe of the application.

All of this is made possible by CLOS.  The definition of a class is separate
from the definition of a method.  Combined with multiple dispatch this means
that the method `WRITE-TO-FILESYSTEM` belongs neither to the file system nor to
the instruction.  New implementations can be added by users without modifying
HSSG.  In a conventional single-dispatch object-oriented system our file system
classes would be large classes which implemented many different methods for
different instructions.  This would make the existing code harder to maintain
and harder to extend because we would have to either have many methods for
instruction classes, or we would have to define many different handler classes
for all the possible combinations.

In fact, I am not sure I would have even come up with this structure to begin
with if it wasn't for CLOS.  We do sacrifice some performance due to dynamic
dispatch and instantiation of new intermediate file systems and instructions,
but the effect is still negligible in a batch application.  The only other
object-oriented system I can think of which separates classes from methods like
this is [Nim].


[HSSG]: https://gitlab.com/HiPhish/cl-hssg
[Nim]: https://nim-lang.org/
