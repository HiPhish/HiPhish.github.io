title: Version 1.1.5 released
tags: old-blog
category: release
---

As per request the custom rendering range now affects drawing as well, not just
rendering. If you are wondering why this wasn't the case before, it was a
leftover from before the custom rendering range got implemented. Originally the
custom range was only meant for rendering because that would be what the layer
sees in the final game, not the drawing, whether they are the same or not.
Also, the drawing is only a drawing, the grid keeps working beyond what's
visible, being infinite. That's why the drawing had low priority and I worked
on other parts instead.

