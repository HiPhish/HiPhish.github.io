title: Introducing IPS-Tools
category: ips-tools
---

I found myself needing a program to apply binary patches in the IPS file format
and I was really disappointed  that there are no proper  Unix programs for that
purpose available.  So I set out to make my own,  but instead of just  applying
patches it would be a complete suite of tools to handle all IPS-related tasks.

[IPS-Tools] is the result, it consists of three standalone CLI programs, one
CLI program that acts as an entry point to the suite, and a C library for
inclusion in other applications. There are three programs because I have
identified three problem domains: applying a patch, generating a patch and
examining a patch.

The tools are all written in C99 using only the standard library, they are tiny
and  should  run  on  pretty  much  anything.  Great  for  embedding  in  other
applications.  In fact,  I have a  GUI frontend that  uses the library  to give
users a drag & drop interface, but it still needs some more polish before I can
release it.

I also took the opportunity  to write a complete specification  of the IPS file
format, because all I was able to find have been bits and pieces everywhere and
only closed-source programs, so I had to piece things together. IPS is a fairly
simple format,  but it  has some  hairy corners  because over  time people have
added  extensions  to it  (compressed records  and truncation).  With IPS-tools
there is a complete  file specification and  a reference implementation  freely
available to the public.

[IPS-Tools]: https://gitlab.com/HiPhish/IPS-Tools
