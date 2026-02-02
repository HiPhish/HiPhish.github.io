---
title: Mirroring a GitLab repository
---

I use [GitLab] to host my various [projects], but it is always a good idea to be
able to have an automatic mirror set up. It adds redundancy in case something
goes wrong with GitLab, and having a mirror on a popular site like [GitHub]
allows people to file issues without signing up for a less popular service. I
am writing this down for myself so I don't have to figure out how to set up a
mirror every time anew. This was written for GitLab version 12.0.0.

In the repository's page select *settings*, then *repository*. In the
repository settings there is a section called *mirroring repositories*, that is
the one we want, so expand it. The first field is the URL of the mirror
repository, in the case of a GitHub mirror for [Awk-ward.nvim] that would be
`https://hiphish@github.com/HiPhish/awk-ward.nvim.git`. Note that we have to
include the *userinfo* (`hiphish`) in the *authority* part
(`hiphish@github.com`) of the URL. The mirror direction is `Push` and the
password is the password for that account.

Instead of typing your GitHub login password into the field, you can generate a
personal access token on GitHub and fill that into the password field instead.

[GitLab]: https://gitlab.com
[projects]: https://gitlab.com/HiPhish
[Awk-ward.nvim]: https://gitlab.com/HiPhish/awk-ward.nvim
[GitHub]: https://github.com
