(defvar *measurements*
  `(("GFGrid"        "520"   "512"  "104"  "1136")
  	("GFRectGrid"    "202"   "167"   "51"   "420")
  	("GFSphereGrid"  "356"   "615"   "92"  "1063")
  	("GFHexGrid"    "1257"  "1102"  "241"  "2600")
  	("GFPolarGrid"   "395"   "366"   "74"   "835")))

(defun numeric-cell (value)
  `((:td :class "numeric") ,value))

(defun table-row (measurement)
  (destructuring-bind (class &rest values) measurement
    `(:tr (:td ,class) ,@(mapcar #'numeric-cell values))))

`((:title .  "What's coming in 2016")
  (:category . "organisation")
  (:content
    (:p
      "It's the start of a new year, time to look back and look ahead. 2015 has
      seen the release of the new website, which was later that same year
      scrapped completely for a yet another website. I was also able to finally
      integrate the last of the originally planned grids into Grid Framework.")
    (:p
      "During this time I have been weighted down by my own mistakes quite a
      lot. When I originally wrote Grid Framework I was fairly inexperienced,
      my knowledge came mostly  from  textbooks and  things you  learn in
      classes.  There was  nothing "
      (:em "technically")
      " wrong about what  I had learned,  the framework was functioning
      correctly, but maintainability was getting worse and worse over time.
      There are some things textbooks simply can't teach you.")
    (:p
      "This  is why I  have  decided to  start work  on  Grid  Framework
      version 2.0.  Following the rules of "
      ((:a :href "http://semver.org") "Semantic Versioning")
      " this means that version 2.0 will not be API-compatible with previous
      versions.  This is a clean cut, but it will result in a leaner and
      cleaner API for users as well,  and everything  removed from the old API
      will  have an almost 1:1  equivalent. If you cannot migrate to 2.0 the
      old 1.x  branch will still be  maintained with  bug-fixes if necessary.
      The upgrade will be free to existing customers.")
    (:h2 "Why version 2.0?")
    (:p
      "I will try to explain my reasons for breaking backwards-compatibility.
      Making a version 2.0 was going to happen sooner or later anyway, so why
      now?")
    (:h3 "The classes are simply too large")
    (:p
      "At the  time of  writing this Grid Framework  is at version 1.9.0  and
      this  is the number of lines in the code:")
    (:table
      (:caption "Summary of lines of code per grid class")
      (:thead
        (:tr
          (:th "Class") (:th "Code") (:th "Comment") (:th "Blank") (:th "Total")))
      (:tbody
        ,@(mapcar #'table-row *measurements*)))
  	(:p
  	  "This is simply too much,  especially for  hexagonal grids.  How did  it
  	  come to this?")
  	(:h3 "Do one thing and do it well")
    (:p
      "What is a *grid* in the first place?  In my case it is a coordinate
      system.  So what does a coordinate system do? It can convert coordinates
      for example.  What it does  not do  is  render  itself  or  align
      objects.  It *can*  be used  for such purpose,  but that not what it does
      itself.  And yet these tasks make up a big part of the code, especially
      in hexagonal grids with their many shapes.")
    (:p
      "Rendering  will  be  moved into  dedicated *renderer*  components. Unity
      does a similar thing for meshes:  the `Mesh` class does not render the
      mesh, the class `MeshRenderer` does.  New grid shapes are then simply new
      renderers,  making it very easy for users to swap out renderers or even
      write their own ones.")
    (:p
      "Other  functions  can  be moved  into special  utility  classes,  I
      haven't yet decided on that one, but they will be moved out of the grid
      for certain.")
  	(:h3 "Less is more")
  	(:p
  	  "Some API features  fall into the  \"nice to have,  but not necessary\"
  	  category.  Take for example the "
      (:code "hideGridOnPlay")
      " flag:  when it is "
      (:code "true")
      " the grid will be hidden while the game is  running but visible in scene
      view.  Sounds handy, but it's not really needed when we could use this
      instead:")
    (:pre
      ((:code :class "language-cs")
        "GFGrid grid;
public void Start() {
    grid.hideGrid = true;
}"))
  	(:p
  	  "And while we're at it,  why do we even have a flag  for hiding the
  	  entire grid when we have flags for the individual axes. Theses \"nice to
  	  have\" features will be cut out entirely.  It might seem like a
  	  regression at first, but the gain in productivity from leaner and more
  	  readable API will easily make up for the few extra lines of code.")
  	(:h3 "You ain't gonna need it")
  	(:p
  	  "When I originally wrote Grid Framework I had  this great idea that you
  	  would be able to call a method on any grid and it would always  do what
  	  you would expect it to do. Sadly some concepts  just don't make sense for
  	  every grid. Take as an example "
  	  (:em "scaling")
  	  " an  object to  the  grid.  This makes  perfect  sense  for a
  	  rectangular grid because an  object's "
  	  (:code "Transform")
  	  " is a cuboid box as well.  But how do you scale  a cuboid in a
  	  honeycomb,  a circle or a sphere?  It just does not make sense to ask
  	  such a question. I will have to see what to keep and what to just throw
  	  out.")
  	(:h3 "Conclusion")
  	(:p
  	  "TL;RD:  It's time to cut off the ugly growth,  and see which parts  have
  	  actual value. Those will be moved to dedicated classes, giving you a
  	  nicer API to work with and make the code more maintainable.")
  	(:p
  	  "At the moment I'm refactoring the renderers out,  this will already
  	  shave off a huge chunk  of code.  Then I'll see  what's next,  I don't
  	  want  to cut off too much, but on the other hand  if I don't cut it off
  	  now it will have to wait for version 3.0.")
  	(:h2 "Grid Framework for other engines")
  	(:p
  	  "2015 has seen a big change in how game engines are licensed.  Unity Pro,
  	  Unreal 4 and Source are now available free of charge for development.
  	  This is a great opportunity to port Grid Framework to those engine as
  	  well. This has been a big motivator  as well for  starting version 2.0,
  	  now that all the  original goals have been met.  Currently all the
  	  classes are too dependent on Unit's API. With smaller classes and a
  	  cleaner API it is much easier to keep different codebases in synch
  	  feature-wise.")
  	(:h2 "In summary")
  	(:p
  	  "I don't have to  announce anything in regards  to other engines yet,  I
  	  want to finish the  move to version  2.0 first  and solidify  the API.
  	  In the meantime there is no reason  to wait for 2.0 if you want to be
  	  productive,  the features to be dropped have  proven themselves  to be
  	  barely useful  anyway and the rest will have pretty  much 1:1
  	  equivalents.  The 1.x code is  not defective,  it is just large, so don't
  	  worry about using the old API.  And as I said, the upgrade will be free
  	  to existing customers.")))

; (define metadata '((title    . "What's coming in 2016")
;                    (category . "organisation")))

; (define content
;   '((p
;       "It's the start of a new year, time to look back and look ahead. 2015 has
;       seen the release of the new website, which was later that same year
;       scrapped completely for a yet another website. I was also able to finally
;       integrate the last of the originally planned grids into Grid Framework.")
;     (p
;       "During this time I have been weighted down by my own mistakes quite a
;       lot. When I originally wrote Grid Framework I was fairly inexperienced,
;       my knowledge came mostly  from  textbooks and  things you  learn in
;       classes.  There was  nothing "
;       (em "technically")
;       " wrong about what  I had learned,  the framework was functioning
;       correctly, but maintainability was getting worse and worse over time.
;       There are some things textbooks simply can't teach you.")
;     (p
;       "This  is why I  have  decided to  start work  on  Grid  Framework
;       version 2.0.  Following the rules of "
;       (a (@ (href "http://semver.org")) "Semantic Versioning")
;       " this means that version 2.0 will not be API-compatible with previous
;       versions.  This is a clean cut, but it will result in a leaner and
;       cleaner API for users as well,  and everything  removed from the old API
;       will  have an almost 1:1  equivalent. If you cannot migrate to 2.0 the
;       old 1.x  branch will still be  maintained with  bug-fixes if necessary.
;       The upgrade will be free to existing customers.")
;     (h2 "Why version 2.0?")
;     (p
;       "I will try to explain my reasons for breaking backwards-compatibility.
;       Making a version 2.0 was going to happen sooner or later anyway, so why
;       now?")
;     (h3 "The classes are simply too large")
;     (p
;       "At the  time of  writing this Grid Framework  is at version 1.9.0  and
;       this  is the number of lines in the code:")
;     (table (@ (class "table-striped table-hover table"))
;       (thead
;         (tr
;           (th "Class") (th "Code") (th "Comment") (th "Blank") (th "Total")))
;       (tbody
;   	    (tr (td       "GFGrid") (td  "520") (td  "512") (td "104") (td "1136"))
;   	    (tr (td   "GFRectGrid") (td  "202") (td  "167") (td  "51") (td  "420"))
;   	    (tr (td "GFSphereGrid") (td  "356") (td  "615") (td  "92") (td "1063"))
;   	    (tr (td    "GFHexGrid") (td "1257") (td "1102") (td "241") (td "2600"))
;   	    (tr (td  "GFPolarGrid") (td  "395") (td  "366") (td  "74") (td  "835"))))
;   	(p
;   	  "This is simply too much,  especially for  hexagonal grids.  How did  it
;   	  come to this?")
;   	(h3 "Do one thing and do it well")
;     (p
;       "What is a *grid* in the first place?  In my case it is a coordinate
;       system.  So what does a coordinate system do? It can convert coordinates
;       for example.  What it does  not do  is  render  itself  or  align
;       objects.  It *can*  be used  for such purpose,  but that not what it does
;       itself.  And yet these tasks make up a big part of the code, especially
;       in hexagonal grids with their many shapes.")
;     (p
;       "Rendering  will  be  moved into  dedicated *renderer*  components. Unity
;       does a similar thing for meshes:  the `Mesh` class does not render the
;       mesh, the class `MeshRenderer` does.  New grid shapes are then simply new
;       renderers,  making it very easy for users to swap out renderers or even
;       write their own ones.")
;     (p
;       "Other  functions  can  be moved  into special  utility  classes,  I
;       haven't yet decided on that one, but they will be moved out of the grid
;       for certain.")
;   	(h3 "Less is more")
;   	(p
;   	  "Some API features  fall into the  \"nice to have,  but not necessary\"
;   	  category.  Take for example the "
;       (code "hideGridOnPlay")
;       " flag:  when it is "
;       (code "true")
;       " the grid will be hidden while the game is  running but visible in scene
;       view.  Sounds handy, but it's not really needed when we could use this
;       instead:")
;     (pre
;       (code (@ (class "language-cs"))
;         "GFGrid grid;\n"
;         "public void Start() {\n"
;         "    grid.hideGrid = true;\n"
;         "}"))
;   	(p
;   	  "And while we're at it,  why do we even have a flag  for hiding the
;   	  entire grid when we have flags for the individual axes. Theses \"nice to
;   	  have\" features will be cut out entirely.  It might seem like a
;   	  regression at first, but the gain in productivity from leaner and more
;   	  readable API will easily make up for the few extra lines of code.")
;   	(h3 "You ain't gonna need it")
;   	(p
;   	  "When I originally wrote Grid Framework I had  this great idea that you
;   	  would be able to call a method on any grid and it would always  do what
;   	  you would expect it to do. Sadly some concepts  just don't make sense for
;   	  every grid. Take as an example "
;   	  (em "scaling")
;   	  " an  object to  the  grid.  This makes  perfect  sense  for a
;   	  rectangular grid because an  object's "
;   	  (code "Transform")
;   	  " is a cuboid box as well.  But how do you scale  a cuboid in a
;   	  honeycomb,  a circle or a sphere?  It just does not make sense to ask
;   	  such a question. I will have to see what to keep and what to just throw
;   	  out.")
;   	(h3 "Conclusion")
;   	(p
;   	  "TL;RD:  It's time to cut off the ugly growth,  and see which parts  have
;   	  actual value. Those will be moved to dedicated classes, giving you a
;   	  nicer API to work with and make the code more maintainable.")
;   	(p
;   	  "At the moment I'm refactoring the renderers out,  this will already
;   	  shave off a huge chunk  of code.  Then I'll see  what's next,  I don't
;   	  want  to cut off too much, but on the other hand  if I don't cut it off
;   	  now it will have to wait for version 3.0.")
;   	(h2 "Grid Framework for other engines")
;   	(p
;   	  "2015 has seen a big change in how game engines are licensed.  Unity Pro,
;   	  Unreal 4 and Source are now available free of charge for development.
;   	  This is a great opportunity to port Grid Framework to those engine as
;   	  well. This has been a big motivator  as well for  starting version 2.0,
;   	  now that all the  original goals have been met.  Currently all the
;   	  classes are too dependent on Unit's API. With smaller classes and a
;   	  cleaner API it is much easier to keep different codebases in synch
;   	  feature-wise.")
;   	(h2 "In summary")
;   	(p
;   	  "I don't have to  announce anything in regards  to other engines yet,  I
;   	  want to finish the  move to version  2.0 first  and solidify  the API.
;   	  In the meantime there is no reason  to wait for 2.0 if you want to be
;   	  productive,  the features to be dropped have  proven themselves  to be
;   	  barely useful  anyway and the rest will have pretty  much 1:1
;   	  equivalents.  The 1.x code is  not defective,  it is just large, so don't
;   	  worry about using the old API.  And as I said, the upgrade will be free
;   	  to existing customers.")))



; (acons 'content content metadata)
