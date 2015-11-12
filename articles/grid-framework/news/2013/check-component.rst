:title: CheckComponent()
:date: 2013-07-03
:tags: old-blog, how-to
:subsite: grid-framework

Here is a quick but handy tip. Recently I found myself needing to reference
various components in my script without knowing if they exist. I have to get
the component and then check if it exists, and if not add it to prevent null
exceptions. Here is what you would write in such a case:

.. code::

   MeshCollider mc = GetComponent<MeshCollider>();
   if (!mc)
       mc = gameObject.AddComponent<MeshCollider>();
   }

First we get the component and store it in a variable, then if it is null we
add the component to the object. Simple, right? True, but if you need to do
this several times it can get messy. You can copy-paste it once with a
different type, but it gets tedious.

Fortunately we can call generics to the rescue! Let's wrap it all up into one
generic function that works on any component:

.. code::

   private T CheckComponent<T>() where T: Component {
       T component = GetComponent<T>();
       if (!component)
           component = gameObject.AddComponent<T>();
       return component;
   }
 
   MeshCollider mc = CheckComponent<MeshCollider>();

Note that it is important for the type T to inherit from Component or else the
methods GetComponent and AddComponent don't make any sense and will throw
errors. We can take this even one step further by making CheckCompnent an
extension method:

.. code::

   using UnityEngine;
   using System.Collections;
    
   public static class ComponentExtensions {
       public static T CheckComponent<T>(this Component theComponent) where T: Component {
           T component = theComponent.GetComponent<T>();
           if (!component)
               component = theComponent.gameObject.AddComponent<T>();
           return component;
       }
   }
 
Now you can call CheckComponent as if it were a part of Unity's standard API,
just like GetComponent.

.. code::

   // use this in any of your scripts:
   MeshCollider mc = CheckComponent<MeshCollider>();

