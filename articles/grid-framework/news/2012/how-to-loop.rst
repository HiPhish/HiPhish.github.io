:title: How to loop through a list and remove items
:date: 2012-11-16
:tags: old-blog, how-to
:subsite: grid-framework

The other day I had the following problem: I had a list of Transfoms and I
wanted to remove the entries that met a certain condition. This is what I had
written:

.. code::

   foreach(Transform trns in transformList){  
       if(AlreadyAligned(trns))  
           transformList.Remove(trns);  
   }

This gave me the following error message: InvalidOperationException: Collection
was modified; enumeration operation may not execute.

This makes sense, I'm modifying the list I'm currently reading and there is no
way I can be sure I'll catch all entries. There are three ways around this
problem: The first is to use LINQ (C# only), the second is instead of removing
the entries at once to store them in a separate list and then use that list in
a second foreach-loop to remove the entries from the first list and the third
solution is to use a for-loop. After some reseach I reached the conclusion that
the for-loop is the fasted way to achieve the needed results. Here is the code:

.. code::

   int counter = transformList.Count;  
   for(int i = 0; i <= counter - 1; i++){  
       if(AlreadyAligned(transformList[i])){  
           transformList.RemoveAt(i);  
           i --; //reduce the indexer because we removed an entry from list  
           counter --; //reduce the counter since the list has become smaller  
       }  
   }

First of all we need to know how many entries the list has initially. I could
have used transformList.Count in the loop directly but this way I don't have to
call the Count method for each iteration. Then we set up the loop, we start at
index 0 and go to counter - 1 (because the index starts at 0 instead of 1). We
perform our check and if it succeeds we remove the entry with index i. Since
the list has now been shortened we need to reduce i because an item that has
been at a position of 7 for example is now at position 6 (assuming that i is
less or equal to 6 in this case). We also need to reduce our counter because
the length of the list has been shortened as well.

As you can see the amount of lines has been doubled, while using LINQ would
have left the code short. If you know that your list will always be small
enough I'd go for the slower but shorter approach. In my case though I have no
idea how large the list will eventually be, so using the for-loop makes perfect
sense. I hope some of you find this useful in the future.
