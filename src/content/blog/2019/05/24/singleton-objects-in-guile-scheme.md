---
title: Singleton objects in Guile Scheme
tags: lisp
---

When I wrote [guile-messagepack] I needed an object to represent the `nil`
value, which embodies the concept of "nothingness" or "no value" in
[MessagePack]. None of the existing objects like `#f` or `'()` were adequate,
so I decided to make a new one: `nothing`. It does not make sense for there to
be multiple instance of `nothing`, so it had to be a singleton. In this blog
post I will describe a way of creating such a singleton.

We first define a new record type `<nothing>` which has no fields. The record
type has a custom printing procedure which displays a nice-looking
representation.

~~~scheme
(define <nothing>
  (make-record-type "<nothing>" '() (λ (rec out) (display "#<nothing>" out))))
~~~

This simply returns a *record type descriptor*, which means that we have told
Guile that such a record type exists and how many slots it has, but Guile has
not defined any constructor or accessors for us. This does not mean that there
is no constructor procedure, it only means that the constructor is not bound to
any variable. It can still be accessed by using the `record-constructor`
procedure and our `<nothing>` record descriptor. We will use this to define our
own constructor.

~~~scheme
(define nothing
  (let ((the-nothing ((record-constructor <nothing>))))
    (λ ()
      "- Scheme Procedure: nothing
     Returns the singleton instance of the MessagePack nothingness object."
      the-nothing)))
~~~

Here we are using the *let-over-λ* technique: we bind one freshly created
instance of the `<nothing>` record to `the-nothing` and return a procedure
which always returns this one instance. Thus each call to `nothing` returns the
same instance:

~~~scheme
;; This always evaluates to #t
(eq? (nothing)
     (nothing))
~~~

Since the results are all `eq?` we can also define a predicate which uses this
fast equality check to verify whether an object is the nothingness object.

~~~scheme
(define (nothing? object)
  "- Scheme Procedure: nothing? object
     Return `#t' if OBJECT is 'eq?' to the MessagePack nothingness object,
     else return `#f'."
  (eq? object (nothing)))
~~~

The user-facing interface consists only of the constructor and the predicate.
The constructor allows us to create new nothingness for packing with
MessagePack and the predicate allows us to decide whether an object unpacked
from MessagePack is a nothingness object.

~~~scheme
(define-module (msgpack nothing)
  #:export (nothing nothing?))
~~~

[guile-messagepack]: https://gitlab.com/HiPhish/guile-msgpack
[MessagePack]: https://msgpack.org/
