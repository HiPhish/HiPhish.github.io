---
title: Making SBCL compliant with the XDG Base Directory specification
category: open-source
tags: unix, lisp
---

The war on dotfiles continues, this time with [SBCL]. Let's see how we can make
it comply with the [XDG Base Directory] specification.

SBCL has a global configuration file `/etc/sbclrc` which we can edit. It is
just regular Common Lisp, so we can do whatever we want; we have access to ANSI
Common Lisp and everything else that comes included with SBCL. Let's go ahead
and add the following lines:

```lisp
(require :asdf)
(let ((default-init-file (funcall sb-ext:*userinit-pathname-function*)))
   (unless (or (null default-init-file)
               (typep default-init-file 'stream)
               (uiop:file-exists-p default-init-file))
     (setf sb-ext:*userinit-pathname-function*
           (lambda () (uiop:xdg-config-home #P"sbcl/init.lisp")))))
```

There is a global function `SB-EXT:*USERINIT-PATHNAME-FUNCTION*` which takes
zero arguments and returns either a pathname designator, a stream or `NIL`.
Before we do anything we check whether any of the following conditions are met:

- Loading a configuration file has been disabled (return value is `NIL`)
- The configuration is loaded from a stream
- The configuration is loaded from a file that does exist

If any of those conditions is met we do nothing because the user expects the
default behaviour. Otherwise we replace the function with one that returns the
path to `$XDG_CONFIG_HOME/sbcl/init.lisp`. As we can see, the [UIOP] package,
which is part of [ASDF] and comes included with SBCL, already has functions for
the XDG Base Directory specification, so most of the work has already been done
for us.


[SBCL]: http://sbcl.org/
[XDG Base Directory]: https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html
[UIOP]: https://common-lisp.net/project/asdf/uiop.html
[ASDF]: https://common-lisp.net/project/asdf/
