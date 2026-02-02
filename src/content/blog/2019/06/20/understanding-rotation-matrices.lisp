(defconstant π 3.141592654 "Constant π")

(defun vector2 (v1 v2)
  "Generate the MathSXML of a 2-vector"
  `(:mfenced (:mtable (:mtr (:mtd ,v1))
                      (:mtr (:mtd ,v2)))))

(defun matrix2x2 (m11 m12 m21 m22)
  "Generate the MathSXML of a 2x2 matrix"
  `(:mfenced (:mtable (:mtr (:mtd ,m11) (:mtd ,m12))
                      (:mtr (:mtd ,m21) (:mtd ,m22)))))

`((:title . "Understanding 2D rotation matrices")
  (:css . ("extra.css"))
  (:content
   (:p "When I first learned about rotation matrices they appeared quite
       “magic”; if you squinted your eyes a bit it sort of made sense, and if
       you did the math you could prove that the matrix does indeed perform the
       rotation and that all the group properties are met, but none of that
       explains " (:em "where") " that form comes from, " (:em "why") " it works.
       In this blog post I will explore a way to derive the formula for
       rotation matrices step by step.  If you wish to follow along you need
       only basic knowledge of linear algebra and trigonometry.")
    (:p "This post makes extensive use of MathML, if your browser does not
       support it you will be seeing gibberish.")
    (:h2 "Points on the unit circle")
    (:p "We start our journey with the simple case of the unit circle. A unit
       circle in the Euclidean plane "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:msup (:mi "E") (:mn "2"))))
       " is a circle with its center at the origin and a radius of "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mn "1")))
       ". Each point on the plane is given by a pair "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mfenced (:mi "x") (:mi "y"))))
       " of coordinates. If we limit ourselves to the unit circle we observe
       that each point is uniquely identified by an angle "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mi "α") (:mo "∈") ((:mfenced :open "[") "0" (:mn "2π"))))
       " around the center. For convenience we will choose that the point "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mfenced (:mn "1") (:mn "0"))))
       " corresponds to the angle "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mi "α") (:mo "=") (:mn "0")))
       ", and that rotations go counter-clockwise. Both of these are
       long-established conventions.")
    (:figure
      ,(let ((r 85)
             (α (/ π 6))
             (φ (/ π 5)))
         `((:svg :xmlns "http://www.w3.org/2000/svg"
                 :version "1.1"
                 :baseProfile "full"
                 :height "100"
                 :viewBox "-10 -100 230 110")
            (:defs
              ((:marker :id "arrow"
                        :viewBox "0 0 10 10"
                        :refX "7" :refY "5"
                        :markerWidth "6"
                        :markerHeight "6"
                        :orient "auto-start-reverse")
                (:path :d "M 0 0 L 10 5 L 0 10 z")))
            ((:line :x1 "-99"
                    :y1 "0"
                    :x2  "99"
                    :y2 "0"
                    :stroke "black"
                    :marker-end "url(#arrow)"))
            ((:line :x1 "0"
                    :y1 "99"
                    :x2 "0" 
                    :y2 "-99"
                    :stroke "black"
                    :marker-end "url(#arrow)"))
            ((:circle :cx "0"
                      :cy "0"
                      :r ,(format nil "~A" r)
                      :fill "none"
                      :stroke-width "2px"
                      :stroke "black"))
            ,@(mapcar  ; The two points
                (lambda (angle)
                  `((:circle :cx ,(format nil "~A" (* r (cos (- angle))))
                             :cy ,(format nil "~A" (* r (sin (- angle))))
                             :r "4px"
                             :fill "black")))
                (list α (+ φ α)))
            ,@(mapcar  ; Point labels
                (lambda (angle symbol)
                  `((:foreignObject :x ,(format nil "~A" (+ (* (* 1.2 r) (cos (- angle))) 0))
                                    :y ,(format nil "~A" (- (* (* 1.2 r) (sin (- angle))) 4))
                                    :height "20px"
                                    :width "300px")
                     ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
                       (:mrow (:mfenced (:mrow (:mo "cos") (:mi ,symbol))
                                        (:mrow (:mo "sin") (:mi ,symbol)))))))
                (list α (+ φ α))
                (list "α" "φ + α"))
            ,@(mapcar  ; Radial lines
                (lambda (angle)
                  `((:line :x1 "0"
                           :y1 "0"
                           :x2 ,(format nil "~A" (* r (cos (- angle))))
                           :y2 ,(format nil "~A" (* r (sin (- angle))))
                           :stroke "black")))
                (list α (+ φ α)))
            ;; The two lines forming the right-angled triangle
            ((:line :x1 ,(format nil "~A" (* r (cos (- α))))
                    :y1 ,(format nil "~A" (* r (sin (- 0))))
                    :x2 ,(format nil "~A" (* r (cos (- α))))
                    :y2 ,(format nil "~A" (* r (sin (- α))))
                    :stroke "black"
                    :stroke-width "2px"))
            ((:line :x1 "0"
                    :y1 "0"
                    :x2 ,(format nil "~A" (* r (cos (- α))))
                    :y2 "0"
                    :stroke "black"
                    :stroke-width "2px"))
            ,@(mapcar  ; The two arcs denoting an angle
                (lambda (α1 α2 r)
                  `((:path :d ,(format nil "M ~A,~A A ~A ~A ~A ~A ~A ~A,~A"
                                       (* r (cos (- α1)))
                                       (* r (sin (- α1)))
                                       r r α 0 0
                                       (* r (cos (- α2)))
                                       (* r (sin (- α2))))
                           :stroke "black"
                           :fill "none")))
                (list 0 α)        ; Start angle
                (list α (+ φ α))  ; End angle
                (mapcar (lambda (f) (* f r)) (list 0.4 0.5)))
            ,@(mapcar  ; Labels of the two arcs
                (lambda (α r label)
                  `((:foreignObject :x ,(format nil "~A" (* r (cos (- α))))
                                    :y ,(format nil "~A" (* r (sin (- α))))
                                    :height "20px"
                                    :width "50px")
                     ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
                       (:mrow (:mi ,label)))))
                (list α (+ α φ -0.1))
                (mapcar (lambda (f) (* f r)) (list 0.5 0.7))
                (list "α" "φ"))))
      (:figcaption "Illustration of Cartesian coordinates based on the angle of rotation"))
    (:p "Using basic trigonometry we can see that for a given angle "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mi "α")))
       " the coordinates of the point are "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mfenced (:mrow (:mo "cos") (:mi "α"))
                          (:mrow (:mo "sin") (:mi "α")))))
       "; this is true because we can draw a right-angled triangle where the
       length of the hypotenuse is the radius of the circle and the lengths of
       the catheti are the coordinates of the point.")
    (:h2 "Rotations along the unit circle")
    (:p "We can rotate the point "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mfenced (:mrow (:mo "cos") (:mi "α"))
                          (:mrow (:mo "sin") (:mi "α")))))
       " around the origin by adding an angle "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mi "φ")))
       " to "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mi "α")))
       ". Thus we are looking for a matrix "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mi "R")
                ((:mo :form "prefix" :fence "true") "(")
                (:mi "φ")
                ((:mo :form "postfix" :fence "true") ")")))
       " which solves the equation"
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML" :display "block")
         (:mrow ,(vector2 '(:mrow (:mo "cos")
                                  ((:mo :form "prefix" :fence "true") "(")
                                  (:mi "φ")
                                  ((:mo :form "infix") "+")
                                  (:mi "α")
                                  ((:mo :form "postfix" :fence "true") ")"))
                          '(:mrow (:mo "sin")
                                  ((:mo :form "prefix" :fence "true") "(")
                                  (:mi "φ")
                                  ((:mo :form "infix") "+")
                                  (:mi "α")
                                  ((:mo :form "postfix" :fence "true") ")")))
               ((:mo :form "infix") "=")
               (:mrow (:mi "R")
                      ((:mo :form "prefix" :fence "true") "(")
                      (:mi "φ")
                      ((:mo :form "postfix" :fence "true") ")"))
               ,(vector2 '(:mrow (:mo "cos") (:mi "α"))
                         '(:mrow (:mo "sin") (:mi "α")))
               (:mtext "."))))
    (:p "We are going to make use of two trigonometric identities, their proof
       is left as an exercise to the reader.")
    ((:math :xmlns "http://www.w3.org/1998/Math/MathML" :display "block")
      (:mtable
        (:mtr
          (:mtd (:mrow
                  (:mo "sin")
                  ((:mo :form "prefix" :fence "true") "(")
                  (:mi "x")
                  ((:mo :form "infix") "±")
                  (:mi "y")
                  ((:mo :form "postfix" :fence "true") ")")))
          (:mtd (:mrow
                  (:mo "=")))
          (:mtd (:mrow
                  (:mo "sin")
                  (:mi "x")
                  (:mo "")
                  (:mo "cos")
                  (:mi "y")
                  ((:mo :form "infix") "±")
                  (:mo "cos")
                  (:mi "x")
                  (:mo "")
                  (:mo "sin")
                  (:mi "y"))))
        (:mtr
          (:mtd (:mrow
                 (:mo "cos")
                 ((:mo :form "prefix" :fence "true") "(")
                 (:mi "x")
                 ((:mo :form "infix") "±")
                 (:mi "y")
                 ((:mo :form "postfix" :fence "true") ")")))
          (:mtd (:mrow
                 (:mo "=")))
          (:mtd (:mrow
                 (:mo "cos")
                 (:mi "x")
                 (:mo "")
                 (:mo "cos")
                 (:mi "y")
                 ((:mo :form "infix") "∓")
                 (:mo "sin")
                 (:mi "x")
                 (:mo "")
                 (:mo "sin")
                 (:mi "y"))))))
    (:p "With these identities we can find the rotation matrix by taking the
       resulting vector apart.")
    ((:math :xmlns "http://www.w3.org/1998/Math/MathML" :display "block")
      ((:mtable :columnalign "right center left")
        (:mtr
          (:mtd
            ,(vector2 '(:mrow (:mo "cos")
                              ((:mo :form "prefix" :fence "true") "(")
                              (:mi "φ")
                              ((:mo :form "infix") "+")
                              (:mi "α")
                              ((:mo :form "postfix" :fence "true") ")"))
                      '(:mrow (:mo "sin")
                              ((:mo :form "prefix" :fence "true") "(")
                              (:mi "φ")
                              ((:mo :form "infix") "+")
                              (:mi "α")
                              ((:mo :form "postfix" :fence "true") ")"))))
          (:mtd (:mo "="))
          (:mtd
            ,(vector2 '(:mrow (:mo "cos")
                              (:mi "φ")
                              (:mo "")
                              (:mo "cos")
                              (:mi "α")
                              ((:mo :form "infix") "-")
                              (:mo "sin")
                              (:mi "φ")
                              (:mo "")
                              (:mo "sin")
                              (:mi "α"))
                      '(:mrow (:mo "sin")
                              (:mi "φ")
                              (:mo "")
                              (:mo "cos")
                              (:mi "α")
                              ((:mo :form "infix") "+")
                              (:mo "cos")
                              (:mi "φ")
                              (:mo "")
                              (:mo "sin")
                              (:mi "α")))))
        (:mtr
          (:mtd "")
          (:mtd (:mo "="))
          (:mtd
            (:mrow
              ,(matrix2x2 '(:mrow (:mo  "cos") (:mi "φ"))
                          '(:mrow (:mo "-sin") (:mi "φ"))
                          '(:mrow (:mo  "sin") (:mi "φ"))
                          '(:mrow (:mo  "cos") (:mi "φ")))
              (:mo "")
              ,(vector2 '(:mrow (:mo "cos") (:mi "α"))
                        '(:mrow (:mo "sin") (:mi "α"))))))))
    (:p "This is indeed the familiar rotation matrix formula. We found it just
       by applying familiar knowledge from trigonometry.")
    (:h2 "Rotation of arbitrary points")
    (:p "Let us now widen our scope to all points in the plane: a point is now
       uniquely identified by its angle "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mi "α")))
       " of rotation and by the distance "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mi "d")))
       " from the origin. Using the same arguments as above, but taking into
       account that the length of the hypotenuse is now "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mi "d")))
       ", we get the coordinates "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
         (:mrow (:mfenced (:mrow (:mi "d") (:mo "") (:mo "cos") (:mi "α"))
                          (:mrow (:mi "d") (:mo "") (:mo "sin") (:mi "α")))))
       ".")
    (:p "It is easy to confirm that our previously found formula for rotation
       matrices works for points outside of the unit circle as well.")
    ((:math :xmlns "http://www.w3.org/1998/Math/MathML" :display "block")
      (:mrow
        ,(vector2 '(:mrow (:mi "d")
                          (:mo "")
                          (:mo "cos")
                          (:mo "(")
                          (:mi "φ")
                          (:mo "+")
                          (:mi "α")
                          (:mo ")"))
                  '(:mrow (:mi "d")
                          (:mo "")
                          (:mo "sin")
                          (:mo "(")
                          (:mi "φ")
                          (:mo "+")
                          (:mi "α")
                          (:mo ")")))
        (:mo "=")
        ,(matrix2x2 '(:mrow (:mo  "cos") (:mi "φ"))
                    '(:mrow (:mo "-sin") (:mi "φ"))
                    '(:mrow (:mo  "sin") (:mi "φ"))
                    '(:mrow (:mo  "cos") (:mi "φ")))
        ,(vector2 '(:mrow (:mi "d") (:mo "") (:mo "cos") (:mi "α"))
                  '(:mrow (:mi "d") (:mo "") (:mo "sin") (:mi "α")))))
    (:h2 "Rotating and scaling points")
    (:p "As far as rotations go we are done, but we can take it a step further
       and add a scaling factor "
       ((:math :xmlns "http://www.w3.org/1998/Math/MathML") (:mi "r"))
       " to the formula as well. If we wish to scale one coordinate of the
       vector we have to scale the corresponding row of the matrix, thus to
       uniformly scale the entire vector we have to uniformly scale the entire
       matrix.")
    ((:math :xmlns "http://www.w3.org/1998/Math/MathML" :display "block")
      (:mrow
        ,(let ((scale '((:mi "r") (:mo "") (:mi "d")))
               (angle '((:mo "(") (:mi "φ") (:mo "+") (:mi "α") (:mo ")"))))
           (vector2 `(:mrow ,scale (:mo "") (:mo "cos") ,@angle)
                    `(:mrow ,scale (:mo "") (:mo "sin") ,@angle)))
        (:mo "=")
        ,(matrix2x2 '(:mrow (:mi  "r") (:mo "") (:mo "cos") (:mi "φ"))
                    '(:mrow (:mi "-r") (:mo "") (:mo "sin") (:mi "φ"))
                    '(:mrow (:mi  "r") (:mo "") (:mo "sin") (:mi "φ"))
                    '(:mrow (:mi  "r") (:mo "") (:mo "cos") (:mi "φ")))
        ,(vector2 '(:mrow (:mi "d") (:mo "") (:mo "cos") (:mi "α"))
                  '(:mrow (:mi "d") (:mo "") (:mo "sin") (:mi "α")))))
    (:h2 "Consequences")
    (:p "A number of operations can be expressed as special cases of our
       rotate-scale matrix.")
    (:dl
      (:dt "Identity")
      (:dd
        (:p "The identity transformation "
           ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
             (:mrow (:mi "id")))
           " is represented by the identity matrix,
           which corresponds to a scale factor of "
           ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
             (:mrow (:mi "r") (:mo "=") (:mn "1")))
           " and rotation angle of "
           ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
             (:mrow (:mi "φ") (:mo "=") (:mn "0")))
           ".")
        ((:math :xmlns "http://www.w3.org/1998/Math/MathML" :display "block")
          (:mrow (:mi "id")
                 (:mo "=")
                 ,(matrix2x2 '(:mn "1") '(:mn "0") '(:mn "0") '(:mn "1")))))
      (:dt "Scaling")
      (:dd
        (:p "A pure scaling has a variable scaling factor "
           ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
             (:mrow (:mi "r")))
           " and a fixed rotation angle of "
           ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
             (:mrow (:mi "φ") (:mo "=") (:mn "0")))
           ". A scaling matrix is thus just a uniformly scaled identity
           matrix.")
        ((:math :xmlns "http://www.w3.org/1998/Math/MathML" :display "block")
          (:mrow (:mi "r")
                 (:mo "")
                 (:mi "id")
                 (:mo "=")
                ,(matrix2x2 '(:mi "r") '(:mn "0") '(:mn "0") '(:mi "r"))
                )))
      (:dt "Inversion or reflection")
      (:dd
        (:p "Reflecting a point along the origin can be interpreted either as a
           rotation by "
           ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
              (:mrow (:mi "φ") (:mo "=") (:mi "π")))
           " without scaling, or as a scaling by "
           ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
              (:mrow (:mi "r") (:mo "=") (:mn "-1")))
           " without rotation. Both yield the same matrix.")
        ((:math :xmlns "http://www.w3.org/1998/Math/MathML" :display "block")
          (:mrow ,(matrix2x2 '(:mrow (:mo  "cos") (:mi "π"))
                             '(:mrow (:mo "-sin") (:mi "π"))
                             '(:mrow (:mo  "sin") (:mi "π"))
                             '(:mrow (:mo  "cos") (:mi "π")))
                 (:mo "=")
                 ,(matrix2x2 '(:mrow (:mn "-1") (:mo "") (:mo  "cos") (:mi "0"))
                             '(:mrow (:mn "-1") (:mo "") (:mo "-sin") (:mi "0"))
                             '(:mrow (:mn "-1") (:mo "") (:mo  "sin") (:mi "0"))
                             '(:mrow (:mn "-1") (:mo "") (:mo  "cos") (:mi "0")))
                 (:mo "=")
                 ,(matrix2x2 '(:mn "-1") '(:mn  "0")
                             '(:mn  "0") '(:mn "-1"))))))
      (:h2 "The group of rotation and scaling matrices")
      (:p "The matrices of rotation and scaling form a group. If we apply a
         transformation to a point, then apply another transformation to the
         result it is equivalent to applying one combined transformation to the
         original point. We combine transformations by multiplying their
         matrices.")
      ((:math :xmlns "http://www.w3.org/1998/Math/MathML" :display "block")
        ,@(let ((r1 '(:msub (:mi "r") (:mn "1")))
                (r2 '(:msub (:mi "r") (:mn "2")))
                (φ1 '(:msub (:mi "φ") (:mn "1")))
                (φ2 '(:msub (:mi "φ") (:mn "2"))))
            `((:mrow
                ,(matrix2x2 `(:mrow ,r2 (:mo "") (:mo  "cos") ,φ2)
                            `(:mrow ,r2 (:mo "") (:mo "-sin") ,φ2)
                            `(:mrow ,r2 (:mo "") (:mo  "sin") ,φ2)
                            `(:mrow ,r2 (:mo "") (:mo  "cos") ,φ2))
                (:mo "")
                ,(matrix2x2 `(:mrow ,r1 (:mo "") (:mo  "cos") ,φ1)
                            `(:mrow ,r1 (:mo "") (:mo "-sin") ,φ1)
                            `(:mrow ,r1 (:mo "") (:mo  "sin") ,φ1)
                            `(:mrow ,r1 (:mo "") (:mo  "cos") ,φ1)))
              (:mrow (:mo "="))
              (:mrow
                ,(let ((scale `(,r2 (:mo "") ,r1))
                       (angle `(((:mo :form "prefix" :fence "true") "(")
                                ,φ2
                                ((:mo :form "infix") "+")
                                ,φ1
                                ((:mo :form "postfix" :fence "true") ")"))))
                   (matrix2x2 `(:mrow ,@scale (:mo "") (:mo  "cos") ,@angle)
                              `(:mrow ,@scale (:mo "") (:mo "-sin") ,@angle)
                              `(:mrow ,@scale (:mo "") (:mo  "sin") ,@angle)
                              `(:mrow ,@scale (:mo "") (:mo  "cos") ,@angle)))))))
      (:p "Not only is this a rotation matrix, the result is also independent of
         the order of operands, something that is generally not true for matrix
         multiplication. We are thus dealing with a commutative magma. This
         magma is also an Abelian group:")
      (:ul
        (:li "The neutral element is the identity transformation.")
        (:li "The inverse of a transformation with scale "
            ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
              (:mrow (:mi "r")))
            " and angle "
            ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
              (:mrow (:mi "φ")))
            " is a transformation with scale "
            ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
              (:mrow (:mfrac (:mn "1") (:mi "r"))))
            " and angle "
            ((:math :xmlns "http://www.w3.org/1998/Math/MathML")
              (:mrow (:mi "-φ")))
            ".")
        (:li "Since matrix multiplication is associative in general, the
            composition of transformations must be associative as well."))
      (:h2 "Conclusion")
      (:p "We have derived the formula for rotation matrices without prior
         knowledge of what result to work towards. Instead we restricted our
         research to a very basic case, that of points on a unit circle, and
         used our knowledge of trigonometry to find a solution. Once we had our
         simple solution we extended our problem domain to that of arbitrary
         points and the scaling of vectors, and looked for ways to extend our
         simple solution to that new domain.")
      (:p "We then investigated some of the properties and concluded that what
         we have is a group structure, which allows use to use all results from
         group theory as well. There is actually much more to rotation
         matrices, but that would be beyond the scope of this post. I mainly
         wanted to show how one can come up with this formula that usually just
         appears like “magic” by starting with a simple base case and then
         further generalising from there.")))
