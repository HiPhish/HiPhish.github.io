title: Introducing NTFS-Clone
category: ntfs-clone
---

This is  a very  useful project  I had  written quite  a while  ago at work and
recently found collecting dust on my hard drive. It lets you create perfect 1:1
copies of NTFS hard drives on Unix.  The problem with every software I had come
across was  that it would copy the data,  but that wasn't enough,  so we had to
run Windows repair on every single drive.

What makes NTFS-Clone different from these other software is that the resulting
drive works out of the box.  I achieved this by  following the Unix philosophy:
there are already  command-line tools  that do small parts of the job,  so if I
can take  them and  glue them  together in  the right  way I  can solve the big
problem.

The result  was rock-stable  and since it  was run on  the command-line we were
able  to automate  the entire process  to clone multiple  drives in  succession
instead of having to babysit them all day. So if you are right now wasting your
time babysitting hard drives,  grab yourself a copy  of [NTFS-Clone] and buy one
of those things where you can plug in several drives and automate your work.

[NTFS-Clone]: https://gitlab.com/HiPhish/ntfs-clone
