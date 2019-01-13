title: Highlighting `NSImageView` the right way
tags: cocoa
---

[Cocoa Drag And Drop example]: https://developer.apple.com/library/mac/samplecode/CocoaDragAndDrop/Introduction/Intro.html

Recently  I have  been working on  a small Cocoa  app and one  of the  things I
needed to do was highlight an  `NSImageView` when the user is hovering above it
while dragging a file.  You would think  that it's a very simple task,  and you
would be right, but judging by some of the things on the internet it looks like
an unsolved problem.

The difficult part about Mac development is not Objective-C, if you know C then
you can learn  Objective-C in a  few days.  The hard part is Cocoa.  Cocoa is a
very old framework,  older than .NET, Java and macOS.  A framework  this old is
guaranteed to have grown a lot  over the years and finding what you are looking
for can  be a  daunting task.  Even Apple's  own documentation  is filled  with
deprecated API calls or downright bad practice.


## The wrong way

Here is how Apple's own documentation highlights an `NSImageView` instance. The
code is from the official [Cocoa Drag And Drop example].

~~~obj-c
-(void)drawRect:(NSRect)rect
    /*------------------------------------------------------
        draw method is overridden to do drop highlighing
    --------------------------------------------------------*/
    //do the usual draw operation to display the image
    [super drawRect:rect];
    
    if ( highlight ) {
        //highlight by overlaying a gray border
        [[NSColor grayColor] set];
        [NSBezierPath setDefaultLineWidth: 5];
        [NSBezierPath strokeRect: rect];
    }
}
~~~

There are other  implementations on the internet,  but those can be excused for
not being official. They all have the same fundamental problem anyway,  so I'll
just use this one for illustration.

The implementation  looks simple  enough and works,  but only  as long  as your
`NSImageView` instance satisfies the assumptions made here.  We assume that our
view object will always have  the outline of a rectangle and we assume that the
chosen colour  will always  be adequate.  In my  case the first  assumption was
already broken from the start because I was using the *Bezel* style for my view
objects, a style that is part of Cocoa itself. There is also no telling when in
the future Apple might change the default colours, making your choice of colour
inadequate. And that's not even going into portability if you want to use
GNUStep to port your app to other operating systems.

What we want is an abstraction.  Abstractions provide us with a clean interface
that can remain stable while  the underlying implementation  can change wildly.
Cocoa has abstractions everywhere, such as using `NSURL` for file paths instead
of C  strings  or even `NSString`.  Doing things  your own  way should  only be
reserved for when  you actually have control over the underlying code.  So if I
were  to  draw my  own  shapes  for an  `NSView` I  would  also  be comfortable
hard-coding my own highlighting.


## The right way™

As it turns out  Cocoa already provides  us with the  means of abstraction  for
highlighting.  The `NSControl` class has the `highlighted` property,  which has
the getter `isHighlighted`,  so we don't need  a new property.  For drawing the
actual highlight `NSView`  provides the method `drawFocusRingMask`.  Subclasses
can override  the property  to implement  their own  highlighting  and  luckily
`NSImageView` does exactly that.

~~~obj-c
- (void)drawRect:(NSRect)dirtyRect {
    [super drawRect:dirtyRect];
    
    if ([self isHighlighted]) {
 	   [self drawFocusRingMask];
    }
}
~~~

Now your code is future-proof and will work regardless of the shape you choose.
Well, at least until Apple deprecates this method.
