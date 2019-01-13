title: A purely functional fixed timestep loop
---

There is a great article by Glenn Fiedler titled [“Fix Your Timestep!”] in
which the author explains various approaches to writing a game loop and
concludes with a loop that provides a fixed time step for simulation. If you
are not familiar with this topic go read the article first and come back later.
The author has written the implementation in C or C++ using a lot of mutation
and looping, so I wanted to give a purely functional approach a shot.

So why do it the functional way? I like challenging myself and I believe you
need to be able to approach a problem from different angles using different
tools in order to *really* understand the problem. When I first read the
article a long time ago I was able to understand *what* the code was doing, but
the reason for *why* the code was doing it was hard to grasp. What really
helped me understand the method was shifting my perspective from the imperative
mindset to a functional signal-processing mindset.

The language I am using is [R7RS] Scheme and my implementation is [Chibi-Scheme],
although any implementation conforming to R7RS should be able to run the code.


## The fundamental idea

The entire application is driven by a loop: the loop measures time and then
based upon that time it simulates and renders the virtual world. The time in
the virtual world needs to sync up with the time of the real world to create
the illusion of looking through a window. However, the programmer must not fall
into the trap of thinking that the time in the simulation needs to match the
time in the real world, only the output has to match.

What does this mean? It means that the simulation only needs to know how much
virtual time has passed in the simulation so far and by how much virtual time
to advance the simulation. Whether this matches up with the real world or not
does not matter for now.

~~~scheme
(define (simulate t Δt) ...)
~~~

This raises the next question: if the simulation is fed the "time" instead of
getting the time itself, where does this "time" come from? The answer is that
there is a function which emits a `Δt` signal. This signal is then received by
the `simulate` function.

~~~scheme
;; `t` is the time that has passed so far in the simulation since it was
;; started, `lag` will be explained later
(define (emit-Δt-signal t lag) ...)
~~~

So what then is calling the emitter function? The game loop. The game loop
measures real time and based on that decides on how many `Δt` signals to emit.
If the loop is running very quickly (high frame rate) it will emit only a few
signals, and if it runs slowly it will emit multiple `Δt` signals. The point is
that neither the signal emitter nor the signal receiver need to be concerned
about the state of the clock.


## The code

All code has to be purely functional, this means no mutation and no shared
state. The only exception is the real-world clock because depending on global
state is the entire point of a clock. To simulate frames taking time I will use
a fake clock which advances time by one second every call.

~~~scheme
;;; Returns the "real" time of the physical world. Actually, it just counts up
;;; from zero, but for our purpose this is simply the real-world clock.
(define real-time
  ;; Store the current time as state with initial value zero.
  (let ((time 0))
    (lambda ()
      (let ((t time))  ; Store the current time in a temporary variable
        ;; Increment the time, but return the time before increment
        (set! time (+ time (jiffies-per-second)))
        t))))
~~~

We will also need some fake `simulate` and `render` functions:

~~~scheme
;; A real simulation function does not take lag, but we want to show it here
(define (simulate t Δt lag)
  (display "Simulating with t=")
  (display t)
  (display ", Δt=")
  (display Δt)
  (display ", lag=")
  (display lag)
  (newline))

(define (render)
  (display "Rendering...\n"))
~~~

These just print something to the standard output. Let's now get to the real
meat: the game loop function. Of course it's not a real loop, it's a recursive
function.

~~~scheme
;;; Run the game loop with fixed time step Δt.
;;;
;;; Parameters:
;;;   t         Total simulation time which has passed so far
;;;   Δt        The fixed tick rate
;;;   time      Total real-world time since the first iteration
;;;   lag       How much the simulation is behind real time
;;;   simulate  Callback to execute on every tick
;;;   render    Callback to execute every frame
;;;   quit      Whether to exit the game loop
(define (run-game-loop Δt t time lag simulate render quit)
~~~

The parameters are in place of what would normally be the state in imperative
programming. `t` is the total virtual time passed so far, `Δt` is the fixed
time step. `lag` is interesting, this is the leftover time that was not
simulated in the previous frame and which will be carried over to the next
frame. `simulate` and `render` are our callback functions and `quit` is a
boolean that tells us whether to exit the loop.

The first item in `run-game-loop` is the definition of the `Δt` emitter.

~~~scheme
;; Emit a Δt signal for simulation
;;
;; Parameters:
;;  t    Virtual time that has passed so far in the simulation
;;  lag  How much the simulation is behind real time
;;
;; Returns: The time the simulation has been advanced by and the remaining
;; lag.
(define (emit-Δt-signal t lag)
  (if (< lag Δt)
    (values t lag)  ; We cannot fit in any more ticks, return
    (begin
      (simulate t Δt lag)
      (emit-Δt-signal (+ t Δt) (- lag Δt)))))
~~~

The `lag` is how much simulation time we have to process. As an example, let's
say our `Δt` is 50 milliseconds and a frame takes one second, that means we can
fit in 20 `Δt` signals with no leftover lag. On the other hand, if our frame
rate is 60Hz and `Δt` 10ms, that means the lag is about 16ms and we can only
fit in one signal.  Furthermore, there are 6ms of lag left which are returned
as the result of the emitter along with the total time simulated.

The emitter will keep pumping out `Δt` signals as long as it can fit `Δt`
inside `lag`. With each iteration it increases the total time simulated `t` by
`Δt` and decrease the `lag` by `Δt`. When it can no longer fit a `Δt` inside
the `lag` it returns the `t` and `lag` as return values.

After this function definition comes the body of the game loop function.

~~~scheme
(let* ((new-time (real-time))
       ;; How long the last frame took to compute
       (frame-time (- new-time time)))
  (let-values (((t lag) (emit-Δt-signal t (+ lag frame-time))))
    (render)
    (if quit
      'done
      (run-game-loop
        Δt
        t
        new-time
        lag
        simulate
        render
        (>= t (* 10 (jiffies-per-second))))))))
~~~

First we measure the current real time when the loop begins, followed by the
time it took for the last frame to finish. This `frame-time` is the time we
have to simulate, plus whatever leftover `lag` we had from the previous
iteration. So we start the `Δt` emitter and store the returned values as the
new `t` and `lag`. Finally we render the output and run the next iteration. In
the code above I have set up the `quit` boolean to be `#f` after simulating ten
seconds, but in reality you would want the condition to depend on user input or
something more sensible.

Here is what the complete function looks like:

~~~scheme
;;; Run the game loop with fixed time step Δt.
;;;
;;; Parameters:
;;;   t         Total simulation time which has passed so far
;;;   Δt        The fixed tick rate
;;;   time      Total real-world time since the first iteration
;;;   lag       How much the simulation is behind real time
;;;   simulate  Callback to execute on every tick
;;;   render    Callback to execute every frame
;;;   quit      Whether to exit the game loop
(define (run-game-loop Δt t time lag simulate render quit)

  ;; Emit a Δt signal for simulation
  ;;
  ;; Parameters:
  ;;  t    Virtual time that has passed so far in the simulation
  ;;  lag  How much the simulation is behind real time
  ;;
  ;; Returns: The time the simulation has been advanced by and the remaining
  ;; lag.
  (define (emit-Δt-signal t lag)
    (if (< lag Δt)
      (values t lag)  ; We cannot fit in any more ticks, return
      (begin
        (simulate t Δt lag)
        (emit-Δt-signal (+ t Δt) (- lag Δt)))))

  (let* ((new-time (real-time))
         (frame-time (- new-time time))) ; How long the last frame took to compute
    (let-values (((t lag) (emit-Δt-signal t (+ lag frame-time))))
      (render)
      (if quit
        'done
        (run-game-loop Δt t new-time lag simulate render (>= t (* 10 (jiffies-per-second))))))))
~~~

Let's take it for a test ride.

~~~scheme
(let ((t 0 )
      (Δt (/ (jiffies-per-second) 2))
      (time (real-time))
      (lag 0)
      (quit #f))
  (run-game-loop Δt t time lag simulate render quit))
~~~

This will run the loop with two simulations per second.

~~~
> (load "loop.scm")
Simulating with t=0, Δt=500, lag=1000
Simulating with t=500, Δt=500, lag=500
Rendering...
Simulating with t=1000, Δt=500, lag=1000
Simulating with t=1500, Δt=500, lag=500
Rendering...
Simulating with t=2000, Δt=500, lag=1000
Simulating with t=2500, Δt=500, lag=500
Rendering...
Simulating with t=3000, Δt=500, lag=1000
Simulating with t=3500, Δt=500, lag=500
Rendering...
Simulating with t=4000, Δt=500, lag=1000
Simulating with t=4500, Δt=500, lag=500
Rendering...
Simulating with t=5000, Δt=500, lag=1000
Simulating with t=5500, Δt=500, lag=500
Rendering...
Simulating with t=6000, Δt=500, lag=1000
Simulating with t=6500, Δt=500, lag=500
Rendering...
Simulating with t=7000, Δt=500, lag=1000
Simulating with t=7500, Δt=500, lag=500
Rendering...
Simulating with t=8000, Δt=500, lag=1000
Simulating with t=8500, Δt=500, lag=500
Rendering...
Simulating with t=9000, Δt=500, lag=1000
Simulating with t=9500, Δt=500, lag=500
Rendering...
Simulating with t=10000, Δt=500, lag=1000
Simulating with t=10500, Δt=500, lag=500
Rendering...
~~~

As we can see, we get two simulations per frame since each frame is one second.
Let's make it a bit more interesting: a game should run at 60 frames per
second, that's about 16ms per frame. The simulation will run at 50Hz, that's
20ms per `Δt`. This means that there will be times when we have to skip
simulation for an entire frame until there is enough lag accumulated. In
particular the first frame will only have 16ms of lag.

~~~scheme
;;; Adjusted clock
(define real-time
  (let ((time 0))
    (lambda ()
      (let ((t time))
        ;; Increment by 1/60th of a second
        (set! time (+ time (floor-quotient (jiffies-per-second) 60)))
        t))))

;;; Adjusted Δt starting value
(let ((t 0 )
      (Δt (/ (jiffies-per-second) 50))
      (time (real-time))
      (lag 0)
      (quit #f))
  (run-game-loop Δt t time lag simulate render quit))
~~~

Here is the output:

~~~
> (load "loop.scm")
Rendering...
Simulating with t=0, Δt=20, lag=32
Rendering...
Simulating with t=20, Δt=20, lag=28
Rendering...
Simulating with t=40, Δt=20, lag=24
Rendering...
Simulating with t=60, Δt=20, lag=20
Rendering...
Rendering...
Simulating with t=80, Δt=20, lag=32
Rendering...
Simulating with t=100, Δt=20, lag=28
Rendering...
Simulating with t=120, Δt=20, lag=24
Rendering...
Simulating with t=140, Δt=20, lag=20
Rendering...
Rendering...
Simulating with t=160, Δt=20, lag=32
Rendering...
Simulating with t=180, Δt=20, lag=28
Rendering...
Simulating with t=200, Δt=20, lag=24
Rendering...
Simulating with t=220, Δt=20, lag=20
Rendering...
Rendering...
~~~

We see that the first frame ran without simulation because there was not enough
lag. The second frame had enough lag for one simulation and left 12ms lag for
the next frame. The third frame had thus 12ms plus its own 16ms for a total of
28ms of lag. As we can see the lag keeps getting shorter and shorter every
frame until in the sixth frame we reach the point where there is not enough lag
and we have to skip simulation for another frame.


## Conclusion

We now have a purely functional implementation of a game loop with fixed time
step. I haven't bothered to implement the extra interpolation found in the
original article since that only involves the renderer. It is very simple to
compute the interpolation factor:

~~~scheme
;;; Add an α parameter
(define (render α) ...)

;;; Inside the game loop
(render (/ lag Δt))
~~~

Since the lag is less than `Δt` the `α` is between zero (inclusive) and one
(exclusive). Another fun idea would have been to make the time increment of
`real-time` random to simulate a fluctuating frame rate.

In my opinion he functional version is somewhat harder to trace through, but
the underlying idea is easier to see than in the imperative implementation. The
functional nature of my implementation has allowed me to unravel the problem
from inside-out; I started with the `simulate` function, then asked myself how
to drive that, came up with `emit-Δt-signal` and finally drove that one by
calling it from `run-game-loop`. In contrast, in the imperative implementation
Glenn Fiedler started with the game loop and then worked his way down to the
simulation with the fixed time step.



[“Fix Your Timestep!”]: http://gafferongames.com/game-physics/fix-your-timestep/
[Chibi-Scheme]: http://synthcode.com/scheme/chibi/
[R7RS]: http://www.r7rs.org

