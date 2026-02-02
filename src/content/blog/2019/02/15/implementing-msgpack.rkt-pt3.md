---
title: Implementing MsgPack.rkt, part 3
tags: msgpack, lisp
category: open-source
---

In the previous article we have seen how to pack an object, this time we will
see how to unpack it again on the receiving end.

This blog post is one of a multipart series. You can find the rest of the
series under the following links:

- [Part 1](../../11/implementing-msgpack.rkt-pt1/): Introduction
- [Part 2](../../13/implementing-msgpack.rkt-pt2/): Packing
- Part 3: Unpacking


## Overview

Just as with the unpacking code we will create a new module and provide only
one procedure: the `unpack` procedure, which accepts one input port as its
argument and returns one unpacked object. A port in a Lisp language is similar
to a file handle in other languages, though it is not necessarily limited to
files only.

~~~racket
(provide unpack)

(: unpack (-> Input-Port Packable))
(define (unpack in)
  ...)
~~~

This is again a simplified view, the actual implementation provides three
procedures: `unpack-from`, `unpack` and `unpack/rest`. These give more
fine-grained control over the source of packed data and how many objects to
unpack. The principle is all the same though, so we will stick with the simple
model.


## Unpacking a dynamically typed object

Before we read our fist byte we do not know the type of the packed objects, so
we again use a procedure which returns an instance of the `Packable` type
introduced in the previous article.

The first byte of the packed data is special: it is a *tag* which allows us to
know the type of the packed object. Our strategy is to first read one byte and
then dispatch on it to a type-specific unpacking procedure based on the numeric
value of the tag.

~~~racket
(: unpack (-> Input-Port Packable))
(define (unpack in)
  (define tag (read-byte in))
  (cond
    ((< tag #x80) tag)
    ((< tag #x90) (unpack-fixmap   tag in))
    ((< tag #xA0) (unpack-fixarray tag in))
    ((< tag #xC0) (unpack-fixstr   tag in))
    ((= tag #xC0) (void))
    ((= tag #xC1) (error "Unused tag value"))
    ((= tag #xC2) #f)
    ((= tag #xC3) #t)
    ((= tag #xC4) (unpack-bin8  in))
    ((= tag #xC5) (unpack-bin16 in))
    ...
    ((= tag #xCC) (unpack-uint8  in))
    ((= tag #xCD) (unpack-uint16 in))
    ((= tag #xCE) (unpack-uint32 in))
    ((= tag #xCF) (unpack-uint64 in))
    ...
    ((= tag #xDC) (unpack-array16 in))
    ...))
~~~

There are a couple of things to note: For small values (less than `0x80`) the
tag is exactly the integer number, so we can return the tag as the result. The
tag values `0xC0`, `0xC2` and `0xC3` correspond to constant values (`#<void>`,
`#f` and `#t`), which we can also return directly.

The types with `fix` in their name are collections for which the tag also
contains information on how many items there are contained. This is a little
hack in MessagePack: if the number of items is small there is no need to waste
memory on the length, instead the length it contained inside the tag and can be
extracted through bit-fiddling.

Finally there are types with fixed tags. For example, the tag `0xCC` will
always correspond to an unsigned 8-bit integer, and the tag `0xC4` will always
correspond to a byte string whose length is an (unsigned) 8-bit integer.


## Type-specific unpacking

We will now have an in-depth look into the unpacking procedures for a selection
of types. Sometimes unpacking one object will also involve unpacking other
objects in the process.


### Integers

Integers can be signed or unsigned and they can be up to 64 bytes large.
Depending on the type of integer we call the more general `unpack-integer` with
different arguments

~~~racket
(: unpack-uint8 (-> Input-Port Integer))
(define (unpack-uint8 in)
  (unpack-integer 1 #f))  ; One byte, not signed

(: unpack-uint16 (-> Input-Port Integer))
(define (unpack-uint16 in)
  (unpack-integer 2 #f))  ; Two bytes, not signed

(: unpack-int8 (-> Input-Port Integer))
(define (unpack-uint8 in)
  (unpack-integer 1 #t))  ; One byte, signed

(: unpack-int16 (-> Input-Port Integer))
(define (unpack-uint16 in)
  (unpack-integer 2 #t))  ; Two bytes, signed
~~~

We will let Racket's `integer-bytes->integer` procedure handle the details; its
arguments are a byte string of raw bytes, whether the integer is signed, and
whether the endianness is big or not (in our case it always is).

~~~racket
(: unpack-integer (-> Integer Boolean Input-Port Integer))
(define (unpack-integer size signed? in)
  (define raw-bytes (read-bytes size in))
  (integer-bytes->integer raw-bytes signed? #t))
~~~


### Arrays

An array is an ordered sequence of objects. I have chosen to represent arrays
as vectors in Racket; a vector is an ordered fixed-length sequence of objects
with fixed-time access, so it is similar to C arrays, C++ vectors, or Python
lists, rather than the usual linked lists used in Lisp.

There are two ways to pack an array: as a fixarray and as a regular array. In
the case of a fixed array the size has to be retrieved from the tag value by
bitwise operations. In the case of a regular array the size is a packed integer
and has to be unpacked first.

~~~racket
(: unpack-fixarray (-> Integer Input-Port (Vectorof Packable)))
(define (unpack-fixarray tag in)
  (define size
    (bitwise-and tag #b00001111))  ; Bitwise 'tag & 00001111'
  (unpack-array size in))

(: unpack-array16 (-> Input-Port (Vectorof Packable)))
(define (unpack-array16 in)
  (define size
    (unpack uint16 in))
  (unpack-array size in))
~~~

Once we know the number of objects we can start recursively unpacking them.
MessagePack allows nesting, so our array might contain other arrays and so on.

~~~racket
(: unpack-array (-> Integer Input-Port (Vectorof Packable)))
(define (unpack-array size in)
  (for/vector : (Vectorof Packable) #:length size ([i (in-range size)])
    (unpack in)))
~~~

This requires a bit of explanation. The `for/vector` expression is a vector
comprehension, it loops over something and for each iteration it adds an item
to the vector. Reading from left to right: `: (Vectorof Packable)` is the type
of the result (a vector of packable objects), `#:length size` says that our
vector will contain `size` objects and `([(i (in-range size))])` says that we
will iterate over the range of numbers from zero (inclusive) to `size`
(exclusive) using the variable `i` to hold the current value. At every
iteration step the object to insert into the array is the result of `(unpack
in)`.

The `for/vector` form is a particularity of Racket, in a more mainstream
language like Python we would have written a for-loop instead.

~~~python
def unpack_array(size, in):
    result = [None] * size  # Create the list of 'size' items
    for i in range(size):
    		result[i] = unpack(in)
    return result
~~~

As an aside, in the case of Python specifically there is also list
comprehensions, which correspond to Racket's vector comprehension, so if you
wanted to write really pythonic code you would have defined the function using
a comprehension.  I am just trying to make a general point here.

~~~python
def unpack_array(size, in):  # Using a comprehension instead of a loop
    return [unpack(in) for i in range(size)]
~~~


### Binary strings

To unpack a binary string we first need to unpack the integer which specifies
the length of the byte string (in bytes).

~~~racket
(: unpack-bin8 (-> Input-Port Bytes))
(define (unpack-bin8 in)
  (define size (unpack-uint8 in))
  (unpack-bin size in))

(: unpack-bin16 (-> Input-Port Bytes))
(define (unpack-bin16 in)
  (define size (unpack-uint16 in))
  (unpack-bin size in))
~~~

All that is left when we have the size is to read that many bytes from the
input port.

~~~racket
(: unpack-bin (-> Integer Input-Port Bytes))
(define (unpack-bytes size in)
  (read-bytes size in))
~~~

Text strings work similarly, except that we also must convert the bytes read to
a Unicode string using the UTF-8 encoding.


## Conclusion

We first read one byte from the input port, this byte is the tag and it tells
us how to proceed. In a few cases the tag represents a constant value which we
can return directly, but most of the time we need to dynamically dispatch to a
type-specific function.

Collection types (like arrays, hash maps or strings) contain a certain number
of items, so we first need to know that number. If the type has `fix` in its
name the count is contained inside the tag and we need to mask the tag byte.
Otherwise the count is contained as a packed integer among the raw bytes, so we
need to unpack it first.  When have to count we can recursively unpack the
individual objects and collect them.

This also goes to show why the MessagePack format is so simple. In JSON given a
list like `[1, 2, 3, 4, 5]` we would have to read through the entire list first
before we can tell how many items the list contains. In MessagePack on the
other hand the length of the list follows immediately after the tag, that way
we can initialise a large enough vector before we begin unpacking the
individual items. There is no need to ever move backwards, making the format
very well suited to byte streams.
