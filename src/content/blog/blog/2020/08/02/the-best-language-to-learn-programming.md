---
title: The best language to learn programming
tags: unix
---

What is the best first language when learning how to program? There have been
many opinions over the years, each with their own selling point: BASIC was
created for beginners, Python is executable pseudocode, JavaScript runs
everywhere on the web, and so on. However, I would argue that the truly best
language has been right under our nose the whole time: the Unix shell.

It is not a particularly good language , but it has some key characteristics
that make it ideal for people new to computer programming. Keep in mind that
this is supposed to be someone's *first* language, not someone's *only*
language.


## What should we expect from a beginner's language?

The principal issue is that when learning to program you actually have to learn
two things simultaneously: you need to learn techniques and principles in the
abstract sense, and you have to learn the concrete language you are using. Once
you have your first language under your belt, every subsequent language will be
easier to learn because you can focus just on the language itself.

There are a few certain key properties a language should have in order to be
considered suitable for a beginners:

- It should be ubiquitous. Every extra piece of software you need to install
	adds an extra hurdle.
- It should have a REPL (an interactive interpreter). Being able to evaluate an
	expression on the fly encourages frequent exprimentation.
- It should be small. Learning a large language is easier when you already know
	how to program in general.
- It should have good documentation, and it should ideally integrate the
	documentation into its own ecosystem. Users should not have to open a web
	browser and navigate to a URL if they want to look up one small detail.
- It should allow users to get results very quickly.
- It should have real-world applicability.

The Unix shell meets all these criteria, but so do many other languages
nowadays, and they are better language than the shell. However, the shell
excels at the last two points, and these two are important enough to make up
for the shell's shortcomings.

What about Microsoft Windows though? It uses its own shell, but thanks to [WSL]
even Windows users can use the Unix shell. It requires installation, but so
does any other language. Or just replace “Unix shell” with “Windows CMD shell”
or “Windows Powershell”.


## A practical programming language

Pick any programming language and ask yourself “how much use can someone get
out of it if they drop out prematurely”. Yes, Python is easy to write and it
has libraries for pretty much anything, but if you drop out halfway through a
book or class, all you have is a fancy calculator.

Now take the shell: if you know how to call a command and how to build pipes
you already know enough to write useful batch scripts and automate your
workflows. You can learn about variables, functions, loops, exit codes and
conditions later. In fact, you can put off learning these concepts until you
actually need them.

Newly acquired knowledge can be put to work very quickly. This means new
learners can get a feeling of success very early on. For anything you might
want there is an application, which can be combined with other applications and
assembled into a larger custom-tailored program. Even writing simple GUI
applications is possible using [Zenity] or [KDialog]. Granted, you wouldn't
want to write complex applications using those, but beginners won't be writing
complex applications anyway.

The operating system package manager makes it very easy to add new capabilities
to the shell. Man-pages offer up to date documentation without requiring access
to the internet. And finally, the shell will always remain relevant, you will
never outgrow it. You can call into any programming language from the shell if
the shell itself is not powerful enough. It is the perfect glue.


## The ugly warts

I mentioned briefly that the shell is a rather bad language, so why am I still
recommending it? Because those ugly warts don't really matter. Shell scripting
is mainly good for writing glue code, code which glues together other existing
applications and scripts. For this it is a perfectly adequate choice, and a
good *starting point* into programming. It is not meant to be the end of the
journey.

The main issue is that in the shell everything is a string, delimited by
whitespace. This is not much of an issue in casual use, but once you start
expanding variables or the output of other shell commands, you have to be
careful to quote and escape everything correctly.

```sh
# Wrong, will create multiple files if the value contains whitespace
touch $file_name

# Correct, variable will expand inside quotation marks
touch "$file_name"
```


## Conclusion

The Unix shell is a ubiquitous programming language with a very large and
comprehensive ecosystem. It empowers users to combine programs and automate
actions even when users are just beginning to learn the shell. It supports the
most common programing concepts like variables, conditions, loops and
functions.

The shell is a very good glue language, but it has its limits. Casual computer
users will be served well enough by the shell, while those who wish to move on
to more robust programming languages will already have programming experience.

So what is a good second programming language? I don't think it matters. Once
you know how to program in general, you should pick your next language based on
what you want to accomplish. Regardless of which language you pick, there will
be a learning curve because every language will have its own idiosyncrasies.
However, that learning curve will be much lower the more experience with
programming in general you have.



[WSL]: https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux
[Zenity]: https://en.wikipedia.org/wiki/Zenity
[KDialog]: https://kde.org/applications/en/utilities/org.kde.kdialog
