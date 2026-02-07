---
title: Let's write FizzBuzz in a functional style for no good reason
tags: python, functional programming
---

Let's write yet another FizzBuzz because that's what the world needs. Here's
the twist though: ours won't be like those other fuddy-duddy lame and bloated
[enterprise-grade] FizzBuzzes.  Oh no, we are ahead of the curve this time,
it's functional time, baby!  We will be using Python though, because Python and
Javascript is the closest most of us will ever get to using a functional
programming language in production.

Me:

> Guido, can we have Haskell?

Guido van Rossum:

> We have functional programming in Python

Functional programming in Python:


## The naive FizzBuzz

Here is how your typical programmer would write his FizzBuzz:

```python
for i in range(100):
    if i % 3 == 0 and i % 5 == 0:
        print('FizzBuzz')
    elif i % 3 == 0:
        print('Fizz')
    elif i % 5 == 0:
        print('Buzz')
    else:
        print(i)
```

Simple and concise, yet this won't do in today's marketplace.  Let's function
it up.


## The functional FizzBuzz

The first thing a real Python programmer does is separate functionality from
execution through an `if __name__ == '__main__'` check.

```python
if __name__ == '__main__':
    for i in range(100):
        if i % 3 == 0 and i % 5 == 0:
            print('FizzBuzz')
        elif i % 3 == 0:
            print('Fizz')
        elif i % 5 == 0:
            print('Buzz')
        else:
            print(i)
```

OK, but that's still nowhere functional, there aren't even any functions!  The
bulk of our logic is the big FizzBuzz check, so that seems like a good
candidate for a function.  And while we're at it I'm also going to
type-annotate the code because functional languages have really fancy type
systems.

```python
def fizzbuzz(i: int) -> str:
    """Fizzes and buzzes a given number into a string."""
    if i % 3 == 0 and i % 5 == 0:
        return 'FizzBuzz'
    elif i % 3 == 0:
        return 'Fizz'
    elif i % 5 == 0:
        return 'Buzz'
    else:
        return str(i)


if __name__ == '__main__':
    for i in range(100):
        print(fizzbuzz(i))
```

This is functional, but I'm not quite feeling it yet.  Our range is a limited
generator, but functional languages are all cool and hip with their infinite
and lazily evaluated collections.  That's what we have generators for in
Python.  The `count` generator will keep supplying us with ascending integers
until the number can no longer fit in memory.  We will use `islice` to pick a
finite  subset of this infinite sequence.

```python
from itertools import count, islice


if __name__ == '__main__':
    for i in islice(count(1), 100):
        print(fizzbuzz(i))
```

Now we are getting somewhere.  Still though, it doesn't feel that functional
unless we have at least one `map`.  Let's use `map` to move the call to
`fizzbuzz` into the loop head.  What's cool about Python 3 as opposed to Python
2 is that `map` returns another lazy iterator, so it's fine to map over the
infinite sequence of `count`.

```python
if __name__ == '__main__':
    for line in islice(map(fizzbuzz, count(1)), 100):
        print(line)
```

Beautiful!  Now our code can only be understood by reading it inside-out.  I
wish we had a `foreach` function for side effects, but this will have to do.
Now there is just one thing left.  Functional languages pride themselves on
pattern-matching, and our `if`-`elif`-`else` chain looks so imperative.  Let's
fix it up before all the cool kids make fun of us.

```python
def fizzbuzz(i: int) -> str:
    """Fizzes and buzzes a given number."""
    match (i % 3, i % 5):
        case (0, 0):
            return 'FizzBuzz'
        case (0, _):
            return 'Fizz'
        case (_, 0):
            return 'Buzz'
        case _:
            return str(i)
```

### Putting it all together

Here it is, a purely functional FizzBuzz in Python.

```python
from itertools import count, islice


def fizzbuzz(i: int) -> str:
    """Fizzes and buzzes a given number."""
    match (i % 3, i % 5):
        case (0, 0):
            return 'FizzBuzz'
        case (0, _):
            return 'Fizz'
        case (_, 0):
            return 'Buzz'
        case _:
            return str(i)


if __name__ == '__main__':
    for line in islice(map(fizzbuzz, count(1)), 100):
        print(line)
```

## Property-testing it

Oops, we got carried away and forgot to write our tests before writing the
implementation.  Let's travel back in time (something, something, delimited
continuations) and fix this. Functional languages are cool and hip with their
[property testing] thanks to the purity of their functions, so of course we are
going to property test as well.  We will use the [Hypothesis] library for our
tests.

Hypothesis will generate a bunch of random numbers and throw them one at a time
at our tests.  If we did everything right each and every single one will pass,
no matter how many random inputs we throw at it.  Because our `fizzbuzz`
function is pure we will never run into any side effects.

Here is what a property tests looks like:

```python
from hypothesis import given
from hypothesis.strategies import integers
from .fizzbuzz import fizzbuzz


@given(integers())
def test_unfizzbuzzable(i):
    """Numbers which are divisible by neither 3 nor 5 are printed as is"""
    assert fizzbuzz(i) == str(i)
```

Of course this will fail because we are throwing any integers at it, not just
those indivisible by 3 and 5.  We need to filter the strategy returned by
`integers` by calling its `filter` method with a condition function.

```python
def fizzable(i: int) -> bool:
    """Number is divisible by three."""
    return i % 3 == 0


def buzzable(i: int) -> bool:
    """Number is divisible by five."""
    return i % 5 == 0


def unfizzable(i: int) -> bool:
    """Number is not divisible by three."""
    return not fizzable(i)


def unbuzzable(i: int) -> bool:
    """Number is  not divisible by five."""
    return not buzzable(i)


@given(integers().filter(unfizzable).filter(unbuzzable))  # <-- UPDATED
def test_unfizzbuzzable(i):
    """Numbers which are divisible by neither 3 nor 5 are printed as is"""
    assert fizzbuzz(i) == str(i)
```

Here we say that we only want integers which are both `unfizzable` and
`unbuzzable` by filtering the randomly picked integers.  With these functions
and their positive counterparts we can also define all the other test cases.


```python
@given(integers().filter(fizzable).filter(unbuzzable))
def test_fizzable(i):
    """Numbers which are divisible by 3 but not by 5 are fizzed"""
    assert fizzbuzz(i) == 'Fizz'


@given(integers().filter(buzzable).filter(unfizzable))
def test_buzzable(i):
    """Numbers which are divisible by 5 but not by 3 are buzzed"""
    assert fizzbuzz(i) == 'Buzz'


@given(integers().filter(fizzable).filter(buzzable))
def test_fizzbuzzable(i):
    """Numbers which are divisible by both 3 and 5 are fizzbuzzed"""
    assert fizzbuzz(i) == 'FizzBuzz'
```

And that's it for testing, each test is only one line and we did not even need
to come up with test cases.


## Needs more lambdas and higher-order functions!

OK, with the tests out of the way it's time to go full-on functional, no more
holding back.  So far we have hard-coded the divisibility by 3 and 5, but what
if our client changes his mind because it's Thursday?  Our code is not flexible
enough, it needs to be declarative and data-driven!

Here is the plan: we provide a rule set in the form of a sequence of rules
which are `(int, str)` pairs, then apply a higher-order function to the rules
to produce the actual fizz-buzzing function.  This way we can have any number
of rules and fizz-buzzing functions in our application and configure them at
runtime.

First we need a `Rule` data structure.  We will use a typed named tuple for
that sweet extra type safety.

```python
from typing import NamedTuple


class Rule(NamedTuple):
    """
    A single rule of the FizzBuzz game.

    Attributes:
    `number`  The rule applies to an integer `i` if it is divisible by this
    `value`   Text which will be part of the output if the rule applies
    """
    number: int
    value: str

    def __str__(self) -> str:
        """A rule is implicitly represented by its value."""
        return self.value

    def test(self, i: int) -> bool:
        """Test whether this rule applies to the given number `i`."""
        return i % self.number == 0
```

The rule has two methods built-in: one to turn into it string value using the
built-in `str` function, and a predicate to apply the rule to an integer. These
methods could have been standalone functions and we can call them as such
(which we actually will do), so we are still functional as far as I am
concerned.  This is how we use rules to do FizzBuzz:

```python
if __name__ == '__main__':
    # ------- Same game as before, but using explicit rules
    rules = [Rule(3, 'Fizz'), Rule(5, 'Buzz')]
    fizzbuzz = compile_rules(rules)
    # ------- From here on the code is the same as before
    for line in islice(map(fizzbuzz, count(1)), 100):
        print(line)
```

The loop is the same, but the `fizzbuzz` function is constructed at runtime
from the list of rules.  The rules are compiled by the `compile_rules`
function.  I intentionally call it compilation because that is what is
happening: we are taking data and creating a real Python function.  If our
Python implementation was producing native machine code we would have an actual
native machine code generator.  But even as it is, this is still quite powerful.

Now for the part that connects everything, our rule set compiler.

```python
def compile_rules(rules: Iterable[Rule]) -> Callable[[int], str]:
    """
    Compiles a rule set into an executable FizzBuzzing function.

    :param rules: Ordered sequence of FizzBuzz rules.
    :return: Function which applied to an integer returns the FizzBuzz result
    """
    rules = list(rules)

    def closure(i: int) -> str:
        # Use a map to apply each rule in succession to the number, filter out
        # indivisible ones.  If the result is empty return the number,
        # otherwise join all the strings.
        s = ''.join(map(str, filter(partial(Rule.test, i=i), rules)))
        match s:
            case '':
                return str(i)
            case _:
                return s

    return closure
```

See, I told you we would be using the methods as standalone functions.  The
compilation result is a new function which can be applied to any integer
number.  It is a closure which closes over the rule set.  What's with the weird
reassignment of `rules` though?  I thought this was functional and that we do
not use assignment!  Well, if we squint really hard we could say that this is a
different `rules` variable which shadows the original `rules` parameter.  I
know, I know, that's not how it works in Python, but in this instance it does
not make a difference, so just roll with it.  I did not want to come up with a
new name for the second `rules` variable because naming things is one of the
two truly hard problems in computer science (the other one being cache
invalidation and off-by-one errors).

OK, but why do we reassign, I mean shadow `rules` in the first place?  In the
realm of functional programming we like to use lazy collections, and some of
these can be exhausted.  In Python a good example of an exhaustible collection
is the [generator].  If we used one of these directly the program would run
fine the first time, but on every subsequent run the generator would be empty
and none of the tests would run.

Oh, and if you are wondering where the promised `lambda` is: I consider
`partial` to be just a fancy way of writing `lambda`.  Both produce an
anonymous function.


## Testing again

Of course I adjusted the tests first before I wrote the above code.  I an just
putting tests here for didactic reasons.  Yeah, that's my story and I'm
sticking with it.

Previously I was generating the numbers to fizz-buzz, but in order to test our
compiler function we need to generate rules as well.  Since each rule depends
on two other values we can use a composite rule, which is a fancy way of saying
that we build a new rule from two existing rules.

```python
from hypothesis import given
from hypothesis.strategies import DataObject, composite, data, integers, text,\
                                  lists, iterables
from .fizzbuzz import Rule, compile_rules


@composite
def rules(draw) -> Rule:
    """
    Returns a strategy which randomly generates FizzBuzz rules.

    :return: Rule with random number and string value
    """
    number = draw(integers(min_value=2))
    value = draw(text(ascii_letters, min_size=1)).title()
    return Rule(number, value)
```

### Testing rules

Let's now write the first test: a rule test succeeds if and only if an integer
`i` is a multiple of the rule's number.  How do we get a multiple from an
arbitrary number `n`?  We multiply it by the number of the rule.  This means we
need our rule and some arbitrary non-negative integer `n` to compute the
multiple.

```python
@given(rules(), integers(min_value=1))
def test_rule_success(rule: Rule, n: int):
    """Rule applies to numbers which are multiple of the rule's number."""
    assert rule.test(n * rule.number)
```

Nothing surprising here, let's move on. A rule test fails if and only if a
number is not a multiple of the number of the rule.  OK, but where do we get
such a number?  We generate one randomly of course!  But wait, we cannot just
take *any* random number, it must not be a multiple.  Remember, we are working
with properties here, so what is the property of a number `x` which is not a
multiple of some number `a`?  It can be written as `x = n * a + i` for any
non-negative integer `n` and some `i` where `0 < i < a`.  This formula
translates pretty much one-to-one to a test.

```python
@given(rules(), integers(min_value=0), integers(min_value=1), data())
def test_rule_failure(rule: Rule, n: int, data: DataObject):
    """
    Rule does not apply to numbers which are not multiple of the rule's number.
    """
    i = data.draw(integers(min_value=1, max_value=rule.number - 1))
    assert not rule.test(n * rule.number + i)
```

Here we use the special `data` strategy which lets us `draw` a random sample
from a strategy from within the test body.  We have to delay generating `i`
because it depends on the rule.  Other than that the test is straight-forward.


### Testing the compiler

With the rules tested it's time to test the compiler.  First we will need a
generator for a rule set.  But we don't want any set of rules, we want a
unambiguous rule set.  What does that mean?  Supposed you had the rules `(3,
Fizz)` and `(5, Fizztastic)`, then a naive search for the substring `Fizz`
would not be able to tell  which of these two rules produced the string.  So we
will sidestep this problem by simply not generating such rule sets.

```python
def unambiguous_rule_names(rules: list[Rule]):
    """None of rule texts contain another rule's text."""
    texts = {rule.value for rule in rules}
    return all(
        not any(text2.startswith(text) for text2 in (texts - {text}))
        for text in texts
    )


@composite
def rulesets(draw, max_size=5) -> Rule:
    """
    Returns a strategy which generates a random FizzBuzz rule set.  All rules
    have unique number and value.  Additionally the value of one rule is
    guaranteed to never be part of another rule's value.  This ensures that
    there is an unambiguous mapping between the output string and the rules
    which produced it.

    :param max_size: Maximum number of rules in the rule set
    :return: Unambiguous ruleset of random rules
    """
    ruleset = draw(lists(rules(), min_size=1, max_size=max_size,
                            unique_by=(lambda r: r.value, lambda r: r.number))
                   .filter(unambiguous_rule_names))
    return ruleset
```

Our rule set has at least one rule, all rules are unique, and on top of that we
filter out the ambiguity.

The first property we will test is idempotence, which is to say that running
the multiple times always generates the same result.  Idempotence matters
because a ruleset might be an exhaustible sequence such as a generator, but we
want the program to work every time, not just on the first run.  That's why we
intentionally use the `iterables` strategy instead of our own `rulesets`
strategy.  The `unambiguous_rule_names` predicate does not work on a generator,
but that's OK, we do not care about ambiguity here, we are only concerned with
preserving the same output, whatever that output might be.

```python
@given(iterables(rules(), min_size=1, max_size=5, unique=True),
       integers(min_value=1))
def test_fizzbuzz_idempotent(rules: list[Rule], n: int):
    """
    Running the program multiple times produces the same result even when the
    rule set is an exhaustible generator.
    """
    program = compile_rules(rules)
    outputs = [program(n) for _ in range(times)]
    assert all(outputs[0] == output for output in outputs)
```

This does not tell us anything about the output itself though, it could be just
`'lol'` each time for all we know.  Let's go ahead and test the output.

```python
@given(rulesets(), integers(min_value=1))
def test_fizzbuzz_contains_value(rules: list[Rule], n: int):
    """
    The output of the program is either the number itself if none of the rules
    apply, or the concatenation of all values of the rules which apply in the
    order the rules were given.
    """
    program = compile_rules(rules)
    expected = ''.join(rule.value for rule in rules if rule.test(n))
    result = program(n)
    match expected:
        case '':
            assert result == str(n)
        case _:
            assert result == expected
```

Great, we have now covered every test case, so we are done, right?  Not so fast
buddy!  Take a closer look at the definition of `expected`.  That's just the
same logic as in the rule, except using a generator comprehension instead of
`map` and `filter`.  So what we have actually tested is that the implementation
does what the implementation does.  That's a tautology, which is utterly
useless as a test.  This is a trap that is easy to fall into.

Let's take a step back and think about what *properties* the output must have.

- If none of the rules apply, then `n` is printed as is.
- The output contains the text value of every rule which applies to `n`
- The output does not contain the text value of any rule which does not apply
  to `n`
- The output preserves the order of rules from the rule set

These are all properties that we can reasonably test without making assumptions
about the whole output string.


### Testing output properties

The first property will be the output if none of the rules apply.

```python
@given(rulesets(), data())
def test_fizzbuzz_number(rules: list[Rule], data: DataObject):
    """A number which not divisible by any rule is printed as is."""
    n = data.draw(integers()
                    .filter(lambda n: not any(r.test(n) for r in rules)),
                  label='number')
    program = compile_rules(rules)
    assert program(n) == str(n)
```

Nothing surprising here, we draw a number for which none of the rules test
positively.  Let's move on.

```python
@given(rulesets(), data())
def test_fizzbuzz_contains_match(rules: list[Rule], data: DataObject):
    """If the number is divisible the result contains the rule's text."""
    n = data.draw(integers()
                    .filter(lambda n: any(r.test(n) for r in rules)),
                  label='number')
    positives = [r for r in rules if r.test(n)]
    program = compile_rules(rules)
    result = program(n)
    present = [r for r in rules if r.value in result]
    assert positives == present
```

Here we draw a number for which any number of rules, but at least one, apply.
Then we compare the list of all rules which apply (`positives`) and all rules
whose text is found within the output (`present`).  This is also why we needed
the rule about unambiguous values above.

Now let's do the opposite.

```python
@given(rulesets(), data())
def test_fizzbuzz_contains_no_mismatch(rules: list[Rule], data: DataObject):
    """
    If the number is not divisible the result does not contain the rule's text
    """
    n = data.draw(integers()
                    .filter(lambda n: any(r.test(n) for r in rules)),
                  label='number')
    negatives = [r for r in rules if not r.test(n)]
    program = compile_rules(rules)
    result = program(n)
    absent = [r for r in rules if r.value not in result]
    assert negatives == absent
```

Here it is slightly different.  First we find all rules whose values which do
not apply (`negatives`), then the ones whose values is not in the results
(`absent`).  If the two are the same the test succeeds.

The final property is the order of values.

```python
@given(rulesets(), data())
def test_fizzbuzz_results_order(rules: list[Rule], data: DataObject):
    """The rule values are in the same order they were given in."""
    n = data.draw(integers().filter(lambda n: any(r.test(n) for r in rules)))
    positives = [r for r in rules if r.test(n)]
    program = compile_rules(rules)
    result = program(n)
    positions = [result.find(r.value) for r in positives]
    assert all(a < b for a, b in pairwise(positions))
```

Here we use `result.find` to find the position of every match.  If and only if
our text values are properly ordered, then those positions will be ordered from
lowest to highest as well.  So all we need to do is test whether for two
adjacent indices `a` and `b` the value of `a` is less than the value of `b`.
The `pairwise` function does exactly what we need: it maps the sequence of
positions to a sequence of consecutive pairs of positions.  This means that for
example `['a', 'b', 'c', 'd']` becomes `[('a', 'b'), ('b', 'c'), ('c', 'd')]`.


## Conclusion

This is obviously all just a joke, no one would write FizzBuzz like this, but
there is also value in trying to do something with one hand tied behind your
back.  But mostly I was just looking for an excuse to try out Hypothesis.

Python is not a functional language, but I was able to get surprisingly far
without using assignment, mutation, side effects or loops.  The only time I had
to use side effects and loops was at the very end to actually show the output.
I did use a class, but I was only using it as a data structure to organize the
code, there was nothing object-oriented about that.

What holds back Python in terms of functional programming is the lack of
tail-call optimisation.  Without it we have to rely on loops eventually.  With
that said, it is surprising how far the `functools` and `itertools` packages,
as well as comprehensions, can take us.  In my case I did not have to use any
recursive function calls, so the lack of tail-call optimisation never bothered
me.  There are a couple of other points that make functional programming
cumbersome, but similar languages like Lua and Javascript have them as well:

- There is a difference between statements and expressions (in functional
  languages everything is an expression)
- Reading code inside-out is hard, Python does not have any pipe operator (like
  `|>` in [Elixir])

All in all though, I would say that it is much easier to move to a true
functional programming language from Python than from a language like C.

As for Hypothesis, I really like it.  The hardest part was changing my mental
model from “if I have this input I expect this output” to “if my input has this
property then my output must have that property”.  It requires careful thinking
about what all the properties can be.  There will still be cases where it makes
sense to manually pick a test case (e.g. in end-to-end tests), I do not expect
to write all my tests around properties from now on.  But with that said, it
will definitely be an important tool in my toolbox.


### Source code

I have created a repository with the final source code.

- [HiPhish/functional-fizzbuzz](https://gitlab.com/HiPhish/functional-fizzbuzz)
  on GitLab
- [HiPhish/functional-fizzbuzz](https://github.com/HiPhish/functional-fizzbuzz)
  mirror on GitHub

[enterprise-grade]: https://github.com/EnterpriseQualityCoding/FizzBuzzEnterpriseEdition
[property testing]: https://en.wikipedia.org/wiki/Property_testing
[Hypothesis]: https://hypothesis.readthedocs.io/en/latest/
[generator]: https://docs.python.org/3/glossary.html#term-generator-expression
[Elixir]: https://elixir-lang.org/
