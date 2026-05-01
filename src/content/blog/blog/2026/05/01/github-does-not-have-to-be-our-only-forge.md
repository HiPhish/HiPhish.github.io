---
title: GitHub does not have to be your only forge
category: open-source
tags: [git]
---

I had moved off GitHub back before it was cool, but recently more and more Free
and Open Source projects have been migrating off GitHub as well, and with how
much of a shitshow the entire service has become I cannot see why anyone would
trust the platform at all anymore.  Actually no, I do know one reason: its user
base. Pretty much everyone is on GitHub.  For all its flaws, GitHub is still
solving this one major social problem.  I am here to give you the good news
that you can get the best of both worlds: move off GitHub and still benefit
from its social inertia.


## Just mirror your code to GitHub

I am using GitLab as my primary forge, but this works with any forge as long as
you can have it push to other services.  When I create a new project I first
create a new repo on GitLab, then another one with the same name on GitHub.
Finally I set up the GitLab repo to push all commits to the GitHub repo.  Now
GitHub is just a mirror.

The repo names do not have to be the same, but its' easier this way.  In my
case I only mirror to GitHub, but you could mirror to more forges if you wanted
to.


## Handling pull requests from GitHub

When someone opens a PR on GitHub I check it out locally on a separate branch,
review it and discuss on GitHub if anything is to be done.  Checking out a PR
locally allows me to open it in my favourite text editor, jump around the code
and run it locally.

```sh
# Use the GitHub CLI
gh pr checkout $ID

# Use Git
git fetch origin pull/$ID/head:$BRANCHNAME
git switch $BRANCHNAME
```

Once it's good to go I do not merge the PR on GitHub, instead I merge it
locally into the `master` branch, then push to `origin` which is on GitLab.
GitLab then pushes the new commits to GitHub, GitHub recognizes the PR as
merged and closes it, giving the PR author attribution in the process.


## Why I will remain on GitHub

Aside from the social inertia my other reasoning is that if I'm going to
freeload I might as well freeload off GitHub.  I know some people have migrated
because they don't want Microsoft to train their slop machines on their code,
but the truth is that as long as your code is out in the open the bots will
find it and suck it up. You might as well get some free infrastructure in
return.


## Solving the social problem

The above is what I would have written earlier this year, but by now GitHub has
become so unreliable that it's even [deleting commits] from the `main` branch (I
know it would eventually pay off to stick with `master`).  This isn't funny
anymore.

The fundamental issue is that there is centralization in the first place.  It
doesn't matter whether it is on GitHub or whatever other major platform might
emerge.  Eventually it will get the EEE treatment (embrace, enshittify,
extinguish) as well.

Federation could solve the issue.  The idea behind federation is that people
can have accounts on different instances of some service but they can still
communicate with each other.  Email is an example of federation: even if Alice
and Bob are on different servers they can still exchange messages.  A federated
forge would allow a user from one forge instance to open issues and PRs on
another instance.  There would be spam for sure, but there already is spam from
slop contributions on centralized platforms, so I don't see how things could be
worse than they already are.

I know GitLab and Forgejo are working on federation.  We'll have to wait and
see what comes out of it.


[deleting commits]: https://news.ycombinator.com/item?id=47881672
