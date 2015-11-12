:title: Unity and properties/accessors
:date: 2013-02-14
:tags: old-blog, how-to
:subsite: grid-framework

As mentioned in the previous post I'd like to relate my experience with using
properties in Unity and how to make them work properly. Properties are a C#
feature and not available in UnityScript (another reason to ditch UnityScript).
To help demonstrate what I mean I will be using a "circle" class.

.. code:: csharp

   public class Circle{
       public float radius;
   }


What are properties?
--------------------

As we can see radius is public and there is nothing stopping someone from
putting in nonsensical values like negative numbers. Since we are in Euclidean
geometry there is no such thing as "anti-length" and we need some way to
restrict the value of radius to positive numbers. One solution would be to make
radius a pivate member and use getters and setters:

.. code:: csharp

   public class Circle{
       private float _radius;
       public void SetRadius(float value){
           _radius = Mathf.Max(0, value);
       }
       public float GetRadius(){
           return _radius;
       }
   }

(the underscore in front of radius is there to mark it as a member variable;
it's just a convention, not mandatory) This gets the job done, but it's ugly
and bloats the syntax. What we need instead is some sort of variable/function
hybrid that acts like a messenger. This is where properties come in. Here is
the same code as above, except using properties:

.. code:: csharp

   public class Circle{
       private float _radius;
       public float radius{
           get{return _radius;}
           set{_radius = Mathf.Max(0, value);}
       }
   }

The property looks like a function that missing the brackets for parameters and
it is treated like a variable in coding. Whenever we assign a value to it by
using the "=" sign we actually call the set and when we use it in computation
we call the get. value always refers to the value on the right hand side of the
"=" sign. Here is an example:

.. code:: csharp

   myCircle.radius = -3; //calls set and sets _radius to 0
   Debug.Log(myCircle.radius); //calls get and returns 0


Why should you use properties?
------------------------------

As you can see accessors allow us to expose member variables in a controlled
fashion. You can put up restrictions on what a certain variable can hold. You
can also create read-only "variables" by omitting the set part. Let's say your
circle class has several formulae using the circumference and you don't want to
type the formula every time. Here is what it would look like using an accessor:

.. code:: csharp

   public class Circle{
       private float _radius;
       public float radius{
           get{return _radius;}
           set{_radius = Mathf.Max(0, value);}
       }
       public float circumference{
           get{return Mathf.Pi * radius * radius;}
       }
   }

There is no such thing as a "circumference" variable, instead its value is
computed on the fly, yet you can still use it as if it were an actual variable:

.. code:: csharp

   float volume = height * myCircle.circumference;

Unity handes rotation using quaternions but you can still use Euler angles in
the editor and in scripting, this is (most likely) the result of using
properties as well. Properties are also great for exposing member variables in
custom inspectors, like I did or Grid Framework. Unfortunately there is a
problem.


Member varibles and the editor
------------------------------

You can treat the property just like any other variable when writing a custom
inspector. However, once you hit play you will notice that your values have
been reset and once you exit play mode or change the scene or anything else
your values reset again. This is because the properties cannot actually store
anything, they just serve to expose private members. The values of private
members don't stick though, that's why everything gets reset. The solution is
to use [SerializeField]:

.. code:: csharp

   public class Circle{,
       [SerializeField]
       private float _radius;
       public float radius{
           get{return _radius;}
       set{_radius = Mathf.Max(0, value);}
       }
       public float circumference{
           get{return Mathf.Pi * radius * radius;}
       }
   }

That's it, now your member variable will get serialized and will be remembered.
It took me a while to find this, but I was finally able to throw out quite a
lot of ugly workarounds. And now there is no reason not to use properties
anymore. Let's end this post by using properties to limit the value of a float
variable to something appropriate for angles:

.. code:: csharp

   private float _angle;
   public float angle{
       get{return _angle;}
       set{return value >= 0 ? value % 360 : 360 + (value % 360);}
   }

