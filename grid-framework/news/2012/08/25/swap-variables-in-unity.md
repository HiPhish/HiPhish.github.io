title: Swap variables in Unity
tags: old-blog, how-to
---

I've decided to go with one HexGrid class and provide enough options. To do
this I will need to swap around variables so I can use the same formulae for
different cases. I could write the swapping part where it is needed, but then
I'd be writing the same thing several times (which is a bad thing to do).
Wouldn't it be better if there was some sort of swapping function? Could that
function work for any type of variable? Could it work without needing to
reassign variables again? Yes to all of that:

~~~cs
void Swap<T>(ref T a, ref T b){  
    T t = b; b = a; a = t;  
}
~~~

It works the usual way, you create a temporary variable, assign one variable to
it, then assign the second to the first and the temporary to the second. The T
stands for the type, this is a generic function, meaning you can use it for any
type you want. You can swap int, float or even something crazy like Collider or
something usermade. The ref means that the changes done to the variables in the
function are reflected right back. Usually a function "copies" the values
passed and leaves the original variables untouched. To use the code you would
write something like

~~~cs
int x = 1, y =2;
Swap<int>(ref x, ref y);
~~~

There are some tricks floating around on the internet without the use of a
temporary variable and using math tricks instead, don't use those. At best your
code just gets ugly, at worst you even get worse performance. Also, you are
limiting yourself to numbers only, whereas this Swap function works for
anything. Hooray for generics!
