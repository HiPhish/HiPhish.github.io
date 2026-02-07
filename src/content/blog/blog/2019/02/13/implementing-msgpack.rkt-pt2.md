---
title: Implementing MsgPack.rkt, part 2
tags: msgpack, lisp
category: open-source
---

In this part of the series I want to go into how to pack data to bytes in
MessagePack. We will see how to dynamically dispatch on type and how to pack a
selection of particular types.

This blog post is part of a multipart series. You can find the rest of the
series under the following links:

- [Part 1](../../11/implementing-msgpack.rkt-pt1/): Introduction
- Part 2: Packing
- [Part 3](../../15/implementing-msgpack.rkt-pt3/): Unpacking


## Overview

The packing code is contained in its own module and we provide one procedure:
`pack` takes a package object and returns a byte string.

~~~racket
(provide pack)

(: pack (-> Packable Bytes))  ; This is a type annotation, read it as "pack
(define (pack datum)          ; maps a Packable to Bytes"
  ...)
~~~

In practice it is a bit more complicated: first of all `pack` can take any
number of arguments and they will all be packed in sequence. Furthermore, there
is another public procedure: `pack-to` takes as arguments an output port
followed by the objects to pack and will write the bytes to the output port
instead of returning them. The underlying principle is the same, I am omitting
these details to keep things simple. By the way, ports in Lisp are like file
handles in most languages, they have nothing to do with network ports.


## Packing an object: type dispatch

The MessagePack specification allows a number of different types to be packed,
so our `pack` procedure only serves as a convenient frontend for more
specialised procedures. Let us first define what even constitutes a packable
object.

~~~racket
(define-type Packable
  (U Void Boolean Integer Real String ...))
~~~

A packable object is one of several types. The `U` stands for "union", so any
of those types listed (`Void`, `Boolean`, `Integer` and so on) is packable. Let
us now define the `pack` procedure.

~~~racket
(: pack (-> Packable Bytes))
(define (pack datum)
  (cond
    ((void?          datum) (pack-void    datum))
    ((boolean?       datum) (pack-boolean datum))
    ((exact-integer? datum) (pack-integer datum))
    ...
    (else (error "Type of " datum " not supported by MessagePack")))
~~~

Here we are dispatching on the exact type of the object. Since a package type
is a union of various types there is no way of knowing of which type `datum`
really is. Even in a statically typed language this type of dynamic type
dispatch can be useful; for example we might want to pass on an object we
received without wanting to look into it.

~~~c
/* This is hypothetical C code */
msgpack_packable_t datum = msgpack_unpack(input_socket);
msgpack_pack(datum, output_socket);  /* Pass on regardless of type */
~~~


## Type-specific packing

Once we know the exact type all we need to do is follow the rules of the
specification. I will only look at some of them here.


### Nothingness (`nil`)

Nothingness is represented by the `nil` type in MessagePack, which corresponds
well to the `Void` type in Racket. In packed form this is just the byte `0xC0`.

~~~racket
(: pack-void (-> Any Bytes))  ; The argument (of any type) it will be ignored
ignored
(define (pack-void datum)
  (bytes #xC0))
~~~


### Booleans (`true` and `false`)

Both truth and falsity are one byte each. This a good use for `if`, which
resembles the ternary operator `?:` in other languages.

~~~racket
(: pack-boolean (-> Boolean Bytes))
(define (pack-boolean b)
  (bytes (if b #xC3 #xC2)))
~~~


### Integers

Here is where it gets interesting: integers can be signed or unsigned, and they
can have different range. When packing we want to prefer the smallest possible
representation. Let us first define a couple of predicates for convenience.

~~~racket
;; Positive and negative fixed-size integers within a certain range
(: +fixint? (-> Integer Boolean))
(define (+fixint? x)
  (< -1 x 128))

(: -fixint? (-> Integer Boolean))
(define (-fixint? x)
  (<= -32 x -1))
~~~
Integers within a small range can be represented very compactly. These are
referred to as `fixnum` in the specification. We can test whether a value is
within a given range by writing `(< a x b)`, which is equivalent to `a < x < b`
in infix notation.

~~~racket
;; Unsigned integers
(: uint8? (-> Integer Boolean))
(define (uint8?  x) (< -1 x (expt 2  8)))
(: uint16? (-> Integer Boolean))
(define (uint16? x) (< -1 x (expt 2 16)))
(: uint32? (-> Integer Boolean))
(define (uint32? x) (< -1 x (expt 2 32)))
(: uint64? (-> Integer Boolean))
(define (uint64? x) (< -1 x (expt 2 64)))

;; Signed integers
(: int8? (-> Integer Boolean))
(define (int8?   x) (<= (- (expt 2  7)) x (sub1 (expt 2  7))))
(: int16? (-> Integer Boolean))
(define (int16?  x) (<= (- (expt 2 15)) x (sub1 (expt 2 15))))
(: int32? (-> Integer Boolean))
(define (int32?  x) (<= (- (expt 2 31)) x (sub1 (expt 2 31))))
(: int64? (-> Integer Boolean))
(define (int64?  x) (<= (- (expt 2 63)) x (sub1 (expt 2 63))))
~~~

Signed and unsigned integers work as usual, we test whether our number is
within a given range. The `sub1` function substitutes one from its argument and
`expt` is exponentiation.

Now let us consider how integers are packed: if it is a `fixnum` we only write
its byte value (possibly after some bit fiddling), otherwise we first have to
write out a *tag* byte, followed by the bytes of the integer. Tags will be
relevant for unpacking the data again.

~~~racket
(: pack-uint (-> Integer Bytes))
(define (pack-uint uint)
  ;; First write out the tag byte
  (define tag
    (cond
      [(+fixint? uint) (bytes)]  ; Empty byte string
      [(uint8?   uint) (bytes #xCC)]
      [(uint16?  uint) (bytes #xCD)]
      [(uint32?  uint) (bytes #xCE)]
      [(uint64?  uint) (bytes #xCF)]
      [else (error "Unsigned integer must not be larger than 2^64 - 1")])
    )
  (bytes-append tag (integer->bytes uint #f)))

(: pack-int (-> Integer Bytes))
(define (pack-int int)
  ...)
~~~

The `integer->bytes` procedure does the actual bit fiddling. I could list it
here, but the details are too specific to Racket. The `bytes-append` procedure
does what it its name implies: it appends two or more byte strings into one new
byte string.


### Binary strings

Binary strings are a sequence of bytes, but we cannot just dump the bytes and
call it a day. In order to unpack the byte string again, the receiver needs to
know that the object is a byte string in the first place, and how many bytes
there are.

~~~racket
(: pack-bytes (-> Bytes Bytes))
(define (pack-bytes bstr)
  (define len (bytes-length bstr))  ; len: Number of bytes in bstr
  (define tag                       ; tag: Needed for unpacking
  	(cond
    	[(uint8?  len) (bytes #xC4)]
    	[(uint16? len) (bytes #xC5)]
    	[(uint32? len) (bytes #xC6)]
    	[else (error "Byte string may only be up to 2^32 - 1 bytes long")]))
  (bytes-append tag
                (integer->bytes len #f)
                bstr))
~~~

The `tag` indicates how large (in bytes) the `len` integer is. Text strings
work similarly, but we also have to take encoding into account, so I'm omitting
it for the sake of brevity.


## Conclusion

A generic wrapper procedure accepts any packable object and dynamically
dispatches on the specific type. What constitutes a packable object depends on
the programming language in question, we might even have to define new types if
our language is insufficient.

Some objects can be packed as just one byte, but most are packed as multiple
bytes. The first byte serves as a tag, it allows us to know the type when
unpacking later. Some types also have "header" data, such as the number of
characters in a string, preceding the actual content (payload).
