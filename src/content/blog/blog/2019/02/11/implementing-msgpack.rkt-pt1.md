---
title: Implementing MsgPack.rkt, part 1
tags: msgpack, lisp
category: open-source
---

When I originally set out to write [MsgPack.rkt], a [Racket] implementation of
the [MessagePack] protocol, I had a hard time wrapping my mind around where to
begin. I had no experience in writing a serialisation library, and reading the
source code of existing implementations only revealed the *what*, but not the
*why*. This is why I'm starting this short mini-series of blog posts to provide
a commentary on my implementation. I hope that it will serve other people who
are looking for a starting point to their own implementations.

I will use [Racket] as my language of choice, since Racket and [Guile] are the
two languages I have contributed implementations for. I am using it only for
illustrative purposes, every concept will be explained in prose to make it
applicable to other languages as well. Racket can be optionally used with
static typing, so I will be using that variant of the language.

I expect the series to span three parts. As it goes on I will add the
corresponding links here.

- Part 1: Introduction
- [Part 2](../../13/implementing-msgpack.rkt-pt2/): Packing
- [Part 3](../../15/implementing-msgpack.rkt-pt3/): Unpacking


## The motivation behind MessagePack

Suppose you have two processes running and you wish to exchange data between
them.  These processes can run on the same machine or on different machines,
they can be written in radically different programming languages with very
different execution models. Consider the following illustration:

~~~
Process 1 is sending data to Process 2 and receiving
data from Process 2


╭─────────────╮          Outgoing          ╭─────────────╮
│             │ ├───────────────────────── │             │
│  Process 1  │                            │  Process 2  │
│             │ ─────────────────────────┤ │             │
╰─────────────╯          Incoming          ╰─────────────╯
~~~

We want to be certain that data can pass back and forth between these processes
without any loss or corruption. For instance, if we send over a multi-byte
integer, the numerical value has to be the same regardless of endianness. We
need an agreed-upon data format that can be sent over the wire. The sender
makes sure the data is *serialised* (or *packed* in MessagePack jargon) when
sending it out, and the receiver *deserialises* (*unpacks*) it to its native
format.

Different formats exist for different purpose. A popular format is [JSON]; it
is easy for humans to write by hand, read and edit manually, but it is also
somewhat verbose and harder to parse for a machine. The following is an example
of what JSON looks like:

~~~JSON
{"compact": true, "schema": 0}
~~~

MessagePack is similar in idea to JSON, but it is binary instead of text-based.
This makes it unreadable to humans, but it requires less memory and parsing it
is very easy for a machine. The equivalent of the above JSON data in
MessagePack consists of the following bytes:

~~~
0x82 0xA7 compact 0xC3 A6 schema 0x00
~~~

I have written out the bytes that are ASCII characters for readability, but as
far as the machine is concerned these are just regular bytes as well. The JSON
code requires 27 bytes, while the MessagePack byte string only requires 18
bytes, and the savings only get better as the amount of data grows.


## Structuring a MessagePack library

The structure will of course depend on the particular language and which
libraries you choose to use, but the general outline is usually the same. We
will ignore the question of *how* data is exchanged, and only focus on how to
prepare data for the exchange.

The are two main tasks: packing and unpacking data for transport. Packing means
that we take an object of a "packable" type (that is an object for which we
know how to transmit it), and we convert it to a sequence of bytes. Depending
on our programming language there might be different ways of packing an object,
in which case we prefer the shortest one.

Unpacking an object works in reverse. We first read one byte to find out which
type of object we are receiving, then we use that information to read the
remaining bytes and return the unpacked object. Only after reading that first
byte do we know how many bytes we actually need to read.

There are other details that need to be taken care of, such as defining
appropriate data types, but these details are left as an exercise to the
reader.


## Little bits of Racket

The articles should be understandable without knowing any Racket, but it never
hurts to know at least the basics so that you can follow along with the code
samples. Racket is a descendent of the Scheme programming language, which is a
language in the Lisp family. Being descended from Scheme, Racket is a
multi-paradigm language with a bias towards functional programming. We won't be
making much use of functional techniques though.


### Lots of irritating superfluous parentheses

Lisp languages have an unusual notation: they use prefix notation with
parentheses for grouping. Take for example the quadratic formula as it would be
written in most programming languages:

~~~python
(-b + sqrt(b * b - 4 * a * c)) / (2 * a)
~~~

This is the familiar infix notation we use every day. Notice that there is a
tree-structure in the expression: the outermost operation is the division
(`/`), its left-hand argument is `-b + sqrt(b * b - 4 * a * c)` and its
right-hand argument is `2 * a`. We can further break up both of these into
tree-structures until we have turned the entire expression into a tree with
atomic objects for its leaves:

~~~
(/)─┬──(+)─┬──(-)───(b)
    │      └──(sqrt)───(─)─┬─(*)─┬─(b)
    │                      │     └─(b)
    │                      └─(*)─┬─(4)
    │                            ├─(a)
    │                            └─(c)
    └──(*)─┬──(2)
           └──(a)
~~~

This is known as an *abstract syntax tree* (AST). If we use parentheses to
group items we can write the AST as one-dimensional plain text (the whitespace
is purely visual). This allows us to express our computation directly in terms
of the AST.

~~~racket
(/ (+ (- b)
      (sqrt (- (* b b)
               (* 4 a c))))
   (* 2 a))
~~~

And with this you know all the syntax there is to Lisp! An s-expression is
either an atom (like `2`, `b` or `+`) or a list of s-expressions (like `(* 4 a
c)`). The first item in the list is the function (or special operator) we want
to apply, the remaining items are its arguments. All that is now left is
knowing which functions and special operators exist; this depends on the
particular dialect of Lisp of course.


### Racket is a dialect of Lisp

Racket has the usual mathematical operators (`+`, `-`, `*`, `/`) and numbers
(integers, floating point and rationals). Variables are defined using the
`define` special form:

~~~racket
(define a 3)     ; Exact integer (comments are introduced with semicolon)
(define r 2/3)   ; Exact fraction
(define π 3.14)  ; Inexact floating-point number (also Unicode glyphs)
~~~

The special form `lambda` (or its synonym `λ`) defines functions. The first
argument to `λ` is the list of function arguments, the remainder is the body of
the function:

~~~racket
(define f (λ (x) (* x x)))  ; f = x ↦ x²
(define (f x) (* x x))      ; A shorthand form for the above
~~~

We will use the shorthand form. These few forms should suffice for now. As a
final note, let us consider conditional expressions. In most langauges `if` is
used to control the flow of a program (if a condition is met, do this,
otherwise do that), but in Lisp `if` is used to return a different value
depending on a condition:

~~~racket
(define (add-inverse x y)
  ;; Add 1/y to x, fall back to ∞ if y is zero
  (+ x
     (if (= y 0)     ; Test for numerical equality
        +inf.0       ; Return +∞ from the if
        (/ 1 y))))   ; Return 1/y from the if
~~~

If there is more than two cases, the `cond` special form can be used rather
than nesting multiple `if` expressions.

~~~racket
(define (add-signum x y)
  ;; Add 0, 1 or -1, to x, depending on y
  (+ x
     (cond
       ((zero? y)      0)
       ((positive? y)  1)
       (else          -1))))
~~~

By the way, the question mark has no particular meaning, it is customary to
name predicates in such a way. A predicate is a function which returns either
truth (`#t`) or falsity (`#f`). Note that `=` is technically also a predicate,
but it does not follow this convention.

Next time we will look at how to Pack objects.



[MsgPack.rkt]: http://docs.racket-lang.org/msgpack/index.html
[MessagePack]: https://msgpack.org/
[Racket]: https://racket-lang.org/
[Guile]: http://www.gnu.org/software/guile/
[JSON]: https://www.json.org/
