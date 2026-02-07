---
title: Writing a ring buffer TDD style
category: misc
tags: python
---

Let's write a [ring buffer] in Python!  OK, that's not particularly exciting.
Let's use [test-drivent development], that should make things a bit more
interesting.  In this blog post I will go over the individual steps and my
train of thought, because TDD requires a certain discipline and mindset. Why a
ring buffer?  A ring buffer is not quite trivial to implement because it has a
couple of edge cases, but at the same time it is not hard to implement either.
This is a post to follow along at home, so grab your text editor and let's get
going.


## Before we start

First we need to establish some common ground.


### Test-driven development

Automated tests are good, especially when they come at different levels of
granularity, we can all agree on this. At least that's what you would think,
but there are still some people who haven't gotten the memo.  Anyway, moving
on. What's so special about TDD that it deserves its own fancy name over just
plain regular testing?

In TDD we do not just write tests along with or after our implementation code,
instead tests are at the forefront.  We first write the test, then we write the
application.  But wait, if we test something that does not yet exist, then the
test cannot work, right? Right!  And that's the key insight: we write the
smallest possible test case first, implement just that case and only once we
got this simple case working do we move on.  Given an expected specification we
perform the following steps in order:

1. Write an automated test which will test exactly one part of the specification
2. Run all tests, only our new test should fail
3. Write the simplest possible implementation to get the test to pass; the code
   is allowed to be ugly and bad
5. Run all tests, they should all pass now
6. Clean up and refactor the implementation code, all tests must still pass
7. Start the cycle all over again with the next part of the specification

By writing a failing test first we ensure that the test is actually testing the
right thing.  When we perform this back-and-forth dance between test and
implementation we make sure that we only test what we implement and that
everything we implement has a corresponding test.  When we write tests after
the fact we risk writing tests which would succeed when they should fail
because they do not actually cover what we think they cover.



### Ring buffers

A ring buffer or circular buffer is a fixed-size sequence of memory to which we
can append items indefinitely.  If the buffer is full, then adding a new item
will overwrite the oldest item, hence why it is called “circular”.  The buffer
may be initially empty and it has a fixed capacity.  This capacity may or may
not change, depending on how we choose to implement it.

Here is what a simple protocol definition in Python would look like:

```python
from typing import TypeVar
T = TypeVar('T')


class RingBuffer[T]:
    """Generic ring buffer which holds up to a fixed number of items."""

    def __init__(self, capacity: int, *items: T):
        ...

    def __getitem__(self, i: int):
        ...

    def __iter__(self):
        ...

    def __len__(self):
        ...

    def push(self, item: T) -> None:
        """
        Append a new item to the buffer, potentially overwriting the oldest
        item if the buffer is already full.  If the buffer is full, all indices
        will shift by one, i.e. the second element is considered the first one,
        and so on.
        """
        ...
```

We initialise the buffer with a given capacity and optionally an arbitrary
number of initial items.  We can push a new item to the buffer, we can get an
item at a given index, we can get the length of the buffer with the standard
`len` function and we can iterate over the buffer.

```python
# Instantiate a new buffer with a capacity of five and three initial items
buffer = RingBuffer(5, 'a', 'b', 'c')

# We can index the buffer like a list
assert 'a' == buffer[0]
assert 'b' == buffer[1]
assert 'c' == buffer[2]

# We can even use negative indices
assert 'a' == buffer[-3]
assert 'b' == buffer[-2]
assert 'c' == buffer[-1]

# We can push new items to the end of the buffer
buffer.push('d')
buffer.push('e')

assert 'd' == buffer[3]
assert 'e' == buffer[4]

# Pushing a new item to a full buffer shifts the indices by one
buffer.push('f')
assert 'b' == buffer[0]  # Used to be 'a'
assert 'c' == buffer[1]  # Used to be 'b'
assert 'd' == buffer[2]  # Used to be 'c'
assert 'e' == buffer[3]  # Used to be 'd'
assert 'f' == buffer[4]  # Used to be 'e'

# We can iterate over the items from oldest to newest
for c in buffer:
    print(c)
````

This will serve as our specification.  There are a couple of missing details
like which exceptions to raise in case of an error, but I want to keep it
compact here.  We will cover these as we go along.  Just be aware that a proper
specification needs to cover edge cases as well, not just the happy path.


## The dance

With the formalities done it is finally time to get coding.  For the remainder
of this article I will assume that you are reasonably familiar with Python and
its tooling.  I will be using type annotations because they are great, but if
you don't like them just ignore them.  For something this simple you don't
really need type annotations.

The test framework is [Pytest]. I could have used the standard unit test
library, but Pytest is just such a joy to use.  The tests are much cleaner and
much more readable.  Don't worry, I won't be using much Pytest magic, so even
if you are not familiar with Pytest you should be able to follow along.

### Setup

I have set up a virtual environment with the following file structure:

```
.
├── ring_buffer
│   ├── __init__.py
└── test
    ├── __init__.py
    ├── conftest.py
    └── test_ring_buffer.py
```

The purposes of the files are as follows

- `ring_buffer/__init__.py` contains the ring buffer implementation
- `test/conftest.py` contains fixtures (a Pytest feature)
- `test/test_ring_buffer.py` contains the actual tests

All files are initially empty.  To run tests execute `pytest` or `python -m
pytest` from the command line in the root directory of the project.


### Implementation

Before we go you might want to take Pytest for spin.  Add this trivial test to
`test/test_ring_buffer.py`

```python
def test_tautology():
    """A test which will always succeed"""
    assert True
````

Run the tests.  If you get an error your setup is wrong.  Get it working before
you continue.  If everything works you can delete this test.


#### Instantiating a buffer

The simplest thing we can test is instantiating a ring buffer.  So let's go
ahead and write a test which does nothing but create a new empty buffer.

```python
from ring_buffer import RingBuffer


def test_instantiate_empty_ring_buffer():
    RingBuffer(3)
```

Well, this will obviously not work, we cannot instantiate a class which we have
not yet defined.  That's OK though, failure to compile (or to run in the case
of Python) counts as a failing test.  We can now implement the most basic class
definition.

```python
from typing import TypeVar
T = TypeVar('T')


class RingBuffer[T]:

    def __init__(self, capacity: int):
        pass
````

Yes, that's all there is.  Remember, we only want the test to pass, nothing
more.  The test does not cover any properties or methods of our buffer, so we
do not implement them yet.

The specification says that we need to be able to pass any number of initial
elements as well.  Add a second test.

```python
def test_instantiate_ring_buffer_with_contents():
    RingBuffer(3, 'a', 'b')
```

This test will fail because the `__init__` method only takes one argument (the
capacity).  We need to extend the signature.  I will omit parts which have not
changed in the implementation from now on.

```python
class RingBuffer[T]:
    def __init__(self, capacity: int, *items: T):
        pass
```

Now both tests will pass.  Note that because we still have the old test we can
be certain that instantiating without initial elements still works.  If we had
forgotten to put the asterisk in front of `items` the test would have caught
the typo for us.

What happens if we pass more initial elements than our buffer can hold?  There
are a number of possibilities, like ignoring the surplus or dropping earlier
elements, but I am opting for a simple solution: raise an exception.  There is
no correct answer here, it's more of a philosophical question, what matters is
that we pick one answer an stick to it.  You know the drill: write a new test.

```python
def test_rejects_initial_overflow():
    with pytest.raises(IndexError):
        RingBuffer(3, 'a', 'b', 'c', 'd')
```

This test will fail because no exception was raised.  It is now time to add the
first bit of logic to `__init__`.

```python
class RingBuffer[T]:
    def __init__(self, capacity: int, *items: T):
        if len(items) > capacity:
            raise IndexError(f'Too many items: {len(items)} > {capacity}')
        pass
```

Three tests in and this is all we have to show for.  Not very encouraging, is
it. This might all seem like stupid busy-work, any beginner could have written
a complete and correct implementation of `__init__` in one go by now.  And I do
agree, but our class will be doing more than just `__init__` and we will be
glad to have a trail of tests to cover our implementation once we get to the
meat of it.


#### Some fixtures

Now that we do know that we can instantiate a buffer we can start testing these
instances.  Because we will need to create a new buffer for each test I am
going to define some Pytest fixtures.  Add the following code to
`test/conftest.py`:

```python
import pytest
from ring_buffer import RingBuffer


@pytest.fixture
def ring_buffer() -> RingBuffer:
    """Provides a three-element ring buffer with a capacity of five."""
    return RingBuffer(5, 'a', 'b', 'c')


@pytest.fixture
def empty_buffer() -> RingBuffer:
    """Provides an empty ring buffer with a capacity of five."""
    return RingBuffer(5)


@pytest.fixture
def full_buffer() -> RingBuffer:
    """Provides a fully occupied ring buffer with a capacity of five."""
    return RingBuffer(5, 'a', 'b', 'c', 'd', 'e')
```

[Fixtures] are one of those magic Pytest features.  If a test has a parameter
with the same name as a function decorated by `pytest.fixture` Pytest will call
the fixture function and inject the return value as a dependency into the test.
This allows us to declare a test like this:

```python
def test_length_of_empty(empty_buffer: RingBuffer):
    assert 0 == len(empty_buffer)
```


#### Indexing the buffer

After we have initialised a buffer we want to index it like a list.  For
consistency we want negative indices to work the same way as in lists.

```python
@pytest.mark.parametrize('c,i', [('a', 0), ('b', 1), ('c', 2), ('a', -3), ('b', -2), ('c', -1)])
def test_get_item(ring_buffer: RingBuffer, c: str, i: int):
    assert c == ring_buffer[i]
```

Here we use another Pytest feature: [parametrized test functions].  This lets
us write several variations of the same test.  Each of these is run
individually. If we had used a loop inside the test, the test would have
aborted at the first failed assertion and we would have no feedback on whether
the other assertions would have passed.

The first failure we get is the fact that `RingBuffer` instances are not
indexable.  Remember, failure to compile (or to type check in this case) is a
test failure. We can add a `_getitem__` method to our ring buffer.

```python
class RingBuffer[T]:
    def __getitem__(self, i: int):
        pass
```

This will at least shut the type checker up, but it won't return the correct
item.  How could it?  We have never stored the items in the buffer to begin
with.  Now is the time to implement data storage.

```python
class RingBuffer[T]:
    def __init__(self, capacity: int, *items: T):
        if len(items) > capacity:
            raise IndexError(f'Too many items: {len(items)} > {capacity}')
        # The buffer storage is backed by a list
        self._items = [item for item in items]

    def __getitem__(self, i: int):
        return self._items[i]
```

With the happy path done we can try the edge cases.  What happens if our index
is out of bounds?

```python
@pytest.mark.parametrize('i', [3, -4])
def test_raise_out_of_bounds_error(ring_buffer: RingBuffer, i: int):
    with pytest.raises(IndexError):
        ring_buffer[i]

@pytest.mark.parametrize('i', [5, -6])
def test_get_outside_bounds_full(full_buffer: RingBuffer, i: int):
    with pytest.raises(IndexError):
        full_buffer[i]
```

Oops, looks like these tests passed out of the box.  It turns out we got this
behaviour for free in our implementation.  There is not much we can do, so
let's move on.


#### Pushing items to the buffer

Now that we can store and retrieve items it is time add new items to the
buffer.  The simplest case is pushing items to a buffer which is not yet full.

```python
def test_pushes_to_nonfull_buffer(ring_buffer: RingBuffer):
    ring_buffer.push('d')
```

This will fail because there is no `push` method, so we define it.

```python
class RingBuffer[T]:
    def push(self, item: T) -> None:
        pass
```

We need to verify that the item is actually in the buffer now.

```python
def test_pushes_to_nonfull_buffer(ring_buffer: RingBuffer):
    ring_buffer.push('d')
    assert 'd' == ring_buffer[3]
```

The simplest implementation is to append it to the list of items.  You might
already see the problem: if the buffer is full we will go beyond its capacity.
We will take care of this issue later when we get to it, for now we choose the
simplest implementation for our *current* needs.

```python
class RingBuffer[T]:
    def push(self, item: T) -> None:
        self._items.append(item)
```

Now we define a separate test case for pushing to a full buffer.  The second
item becomes the first, the third item becomes the second, and so on until the
new item becomes the last one.  The previous first item is dropped.

```python
@pytest.mark.parametrize('c,i', [('b', 0), ('c', 1), ('d', 2), ('e', 3), ('f', 4)])
def test_push_one_to_full_buffer(full_buffer: RingBuffer, c: str, i: int):
    full_buffer.push('f')
    assert c == full_buffer[i]
```

We need to adjust our ring buffer implementation to store the capacity and a
“head” which points to the current first item in the list.  Whenever we add a
new item the head moves forward by one.

```python
class RingBuffer[T]:
    def __init__(self, capacity: int, *items: T):
        if len(items) > capacity:
            raise IndexError(f'Too many items: {len(items)} > {capacity}')
        self._items = [item for item in items]
        self._capacity = capacity
        self._head = 0

    def __getitem__(self, i: int):
        if i >= self._capacity or i < -self._capacity:
            raise IndexError(f'Out of bounds: {i} > {self._capacity}')
        if i < 0:
            i = len(self._items) + i
        i = (self._head + i) % self._capacity
        return self._items[i]

    def push(self, item: T) -> None:
        if self._capacity > len(self._items):
            self._items.append(item)
            return
        self._items[self._head] = item
        self._head = (self._head + 1) % self._capacity
```

As long as the buffer is not yet full we can keep adding to it.  Once it is
full we have to overwrite the entry pointed to by `_head` and increment it by
one.  We also take the result modulo the capacity to roll over once we reach
the end of the buffer.  The same now goes for getting an item by index.

Note that we now have to handle out of bounds explicitly!  Previously we were
getting this for free, but because our `i` now rolls over we have to check
ourselves.  Fortunately we already had a test case written, so the regression
got caught in time.

Let's go ahead and add a few more items to the full buffer until we have rolled
over twice.

```python
@pytest.mark.parametrize('c,i', [('c', 0), ('d', 1), ('e', 2), ('f', 3), ('g', 4),])
def test_push_two_to_full_buffer(full_buffer: RingBuffer, c: str, i: int):
    full_buffer.push('f')
    full_buffer.push('g')
    assert c == full_buffer[i]


@pytest.mark.parametrize('c,i', [('d', 0), ('e', 1), ('f', 2), ('g', 3), ('h', 4)])
def test_push_three_to_full_buffer(full_buffer: RingBuffer, c: str, i: int):
    full_buffer.push('f')
    full_buffer.push('g')
    full_buffer.push('h')
    assert c == full_buffer[i]


@pytest.mark.parametrize('c,i', [('e', 0), ('f', 1), ('g', 2), ('h', 3), ('i', 4)])
def test_push_four_to_full_buffer(full_buffer: RingBuffer, c: str, i: int):
    full_buffer.push('f')
    full_buffer.push('g')
    full_buffer.push('h')
    full_buffer.push('i')
    assert c == full_buffer[i]


@pytest.mark.parametrize('c,i', [('f', 0), ('g', 1), ('h', 2), ('i', 3), ('j', 4)])
def test_push_five_to_full_buffer(full_buffer: RingBuffer, c: str, i: int):
    full_buffer.push('f')
    full_buffer.push('g')
    full_buffer.push('h')
    full_buffer.push('i')
    full_buffer.push('j')
    assert c == full_buffer[i]


@pytest.mark.parametrize('c,i', [('g', 0), ('h', 1), ('i', 2), ('j', 3), ('k', 4)])
def test_push_six_to_full_buffer(full_buffer: RingBuffer, c: str, i: int):
    full_buffer.push('f')
    full_buffer.push('g')
    full_buffer.push('h')
    full_buffer.push('i')
    full_buffer.push('j')
    full_buffer.push('k')
    assert c == full_buffer[i]
```

Our implementation is good enough that all of these test cases work properly,
it is just a ring buffer after all.  This is not always a given though.  When I
originally wrote a ring buffer implementation the last test case was not
working because the head only rolled over once.  Coming up with enough tests to
cover all edge cases is a matter of experience and intuition, not a hard
science.


#### Buffer length

The length of a buffer is the number of items it currently holds.  You know the
drill.

```python
def test_length_of_empty(empty_buffer: RingBuffer):
    assert 0 == len(empty_buffer)
```

Once more, the simplest implementation.

```python
class RingBuffer[T]:
    def __len__(self):
        return 0
```

Now the same for buffers with actual content.

```python
def test_length_of_nonempty(ring_buffer: RingBuffer):
    assert 3 == len(ring_buffer)


def test_length_of_full(full_buffer: RingBuffer):
    assert 5 == len(full_buffer)
```

Yes, I cheated a bit and added two tests at the same time.  This post already
large enough, so I am taking some liberty here.

```python
class RingBuffer[T]:
    def __len__(self):
        return len(self._items)
```


#### Iterating over the buffer

To make our ring buffer more Pythonic let's make it iterable.

```python
def test_iterate_over_empty_buffer(empty_buffer: RingBuffer):
    items = [item for item in empty_buffer]
    assert [] == items
```

Iteration requires a separate iterator class.  We will define the simplest
possible implementation for now that gets the basic test case to pass.

```python
class RingBuffer[T]:
    def __iter__(self):
        return _RingBufferIterator()


class _RingBufferIterator:
    def __iter__(self):
        return self

    def __next__(self):
        raise StopIteration()
```

This iterator is stateless, it will terminate immediately, which is good enough
for an empty buffer.  With the skeleton done we can start adding meat to it for
non-empty buffers.

```python
def test_iterate_over_nonempty_buffer(ring_buffer: RingBuffer):
    items = [item for item in ring_buffer]
    assert ['a', 'b', 'c'] == items
```

The iterator has to be made stateful, it needs a reference to the buffer.  This
means we need an `__init__` method which takes the current buffer as an
argument.

```python
class RingBuffer[T]:
    def __iter__(self):
        return _RingBufferIterator(self)


class _RingBufferIterator:
    def __init__(self, buffer: RingBuffer):
        self._buffer = buffer
        self._index = 0

    def __iter__(self):
        return self

    def __next__(self):
        try:
            self._index += 1
            return self._buffer._items[self._index - 1]
        except IndexError:
            raise StopIteration()
```

Will this work for a full buffer as well?

```python
def test_iterate_over_full_buffer(full_buffer: RingBuffer):
    items = [item for item in full_buffer]
    assert ['a', 'b', 'c', 'd', 'e'] == items
```

Unsurprisingly it does.  But wait, does it still work if we push a new item to
a full buffer?

```python
def test_iterate_over_buffer_with_shifted_index(full_buffer: RingBuffer):
    full_buffer.push('f')
    items = [item for item in full_buffer]
    assert ['b', 'c', 'd', 'e', 'f'] == items
```

No it does not because we assume that the first item of the buffer is the first
item of the backing storage.  We have to fix our iterator implemenation.

```python
class _RingBufferIterator:
    def __next__(self):
        if self._index == self._buffer._capacity:
            raise StopIteration()
        try:
            value = self._buffer[self._index]
        except IndexError:
            raise StopIteration()
        self._index += 1
        return value
```


### The final implementation

Here is the complete implementation code.  Is this the best implementation?
Maybe, maybe not.  That is not the point, the point is that we now have a
working implemementation with all the right test cases.  With these tests as
our safety net we can then proceed to refactor and optimize the code without
fear of introducing regressions.

```python
from typing import TypeVar
T = TypeVar('T')


class RingBuffer[T]:
    """Generic ring buffer which holds up to a fixed number of items."""

    def __init__(self, capacity: int, *items: T):
        if len(items) > capacity:
            raise IndexError(f'Too many items: {len(items)} > {capacity}')
        self._items = [item for item in items]
        self._capacity = capacity
        self._head = 0

    def __getitem__(self, i: int):
        if i >= self._capacity or i < -self._capacity:
            raise IndexError(f'Out of bounds: {i} > {self._capacity}')
        if i < 0:
            i = len(self._items) + i
        i = (self._head + i) % self._capacity
        return self._items[i]

    def __len__(self):
        return len(self._items)

    def __iter__(self):
        return _RingBufferIterator(self)

    def push(self, item: T) -> None:
        """
        Append a new item to the buffer, potentially overwriting the oldest
        item if the buffer is already full.  If the buffer is full, all indices
        will shift by one, i.e. the second element is considered the first one,
        and so on.
        """
        if self._capacity > len(self._items):
            self._items.append(item)
            return
        self._items[self._head] = item
        self._head = (self._head + 1) % self._capacity


class _RingBufferIterator:
    """Iterator class for ring buffers, internal use only."""

    def __init__(self, buffer: RingBuffer):
        self._buffer = buffer
        self._index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self._index == self._buffer._capacity:
            raise StopIteration()
        try:
            value = self._buffer[self._index]
        except IndexError:
            raise StopIteration()
        self._index += 1
        return value
```

Here are some ideas for where to go from here:

- Use some different data structure for the backing storage
- Validate the `capacity` value passed to `__init__`
- Implement slicing the ring buffer
- Allow changing the capacity of an existing buffer
- Implement dropping elements from the buffer

With every change we will have our test cases to catch regressions.


## Closing thoughts

Was all this really necesarry?  Couldn't a good programmer have written a
correct implementation in one sitting?  Sure, but even the best of programmers
will eventually slip up and make an off-by-one error, which is one of the two
hardest problems in programming (the other one being cache invalidation and
naming).  TDD is a discipline which aims to reduce the probability of making
mistakes.  It does not matter how good you are, a mistake is a mistake, and we
want to avoid making them whenever possible.  If fact, I would argue that good
programmers need good tesing more than bad programmers because good programmers
are the ones who will have the more important work entrusted to them, which
means their mistakes will have more catastrophic consequences.

At first you might feel like TDD slows you down.  Why on earth would first
write a function which always returns `0`, and then go and write the actual
formula instead of just writing the formula directly?  Yes, it does slow you
down initially, but in the long run it will actually let you go faster because
you have the confidence that all the previous parts of the specification are
covered and that you won't introduce any regressions.  After a few turns back
and forth you will fall into the rythm and switching between implementation and
test will feel like a dance.

So, should you always use TDD from now on?  Some people would say that yes, you
should.  I disagree.  TDD works great in our little toy example because we have
a precise specification of what we want to build and we know that it can be
done.  This is not always the case though.  Sometimes I don't know exactly what
it is that I actually want to build, or if I do I might not know exactly how it
can be done.  In this exploratory phase I consider TDD more of a burden because
I might have to throw most or all the test away eventually.  Some people would
argue that tests are actually great for exploration and I do agree with their
arguments to some extent, I just don't think they are strong enough.

Testing is not a replacement for reasoning.  Just because you have found a
formula that holds true in a hundred individual cases that does not mean that
it actually holds true for every case.  If you do not actually understand how
to solve a problem you will just be stuck shuffling code around hoping you
stumble upon what you think the correct formula is.

Where I absolutely support TDD though is bug fixing.  When there is a bug write
a test first to replicate the bug, then fix it.  This way you make sure that
the test is actually testing for that bug and you make sure that the bug does
not come back later.


[ring buffer]: https://en.wikipedia.org/wiki/Circular_buffer
[test-drivent development]: https://en.wikipedia.org/wiki/Test-driven_development
[Pytest]: https://docs.pytest.org/en/6.2.x/
[Fixtures]: https://docs.pytest.org/en/6.2.x/fixture.html#fixture
[parametrized test functions]: https://docs.pytest.org/en/6.2.x/fixture.html#fixture
