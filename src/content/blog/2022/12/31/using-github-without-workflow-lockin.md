---
title: Using GitHub without workflow lock-in
category: organisation
tags: rant, git
modified: 2023-02-26
---

Git is a decentralized version control system, meaning that there is no one
superior repository.  Every single copy of a Git repository is just as complete
as any other.  Of course we can pick one particular repository and declare it
to be the one source of truth, the “upstream” repository.  Usually this
upstream repository is then hosted on some server, and if we are interested in
openness and collaboration this server is part of a larger web service, called
a “forge”.  Out of these forges [GitHub] is perhaps the most popular one.
Unfortunately this means if we are interested in contributions we have to make
the GitHub repo our upstream and use its web services and web UI for our
workflow.  At least that is the common wisdom, but it does not have to be that
way.

Recently I had the pull request [#2] filed in a Neovim plugin repo of mine.  I
wanted to see if it was possible to perform all the collaboration steps without
touching the GitHub UI once and without pushing anything to the GitHub repo.
The good news is that it was 100% feasible and it is going to be my preferred
way of using GitHub from now on.


## The scenario

My Neovim plugin [nvim-cmp-vlime] is hosted on [GitLab].  There I have GitLab
set up to mirror any commits to the `master` branch to the [GitHub mirror]
repository.  A contributor found the project on GitHub and created a pull
request using the usual GitHub workflow: he forked the project, created a
feature branch, committed his changes, pushed the feature branch to his fork on
GitHub and created a pull request.

The upstream repository does not have to be on GitLab, any forge which can
automatically push to a mirror will do the trick.


## Communication via email

Whenever a new pull request or issue is filed I get notified via email.  I can
then either log in to GitHub or reply directly to the email.  If I do the
latter GitHub will add the message as a comment to the PR.  There is some
server-side magic going on that maps the email address of the message to the
discussion thread, but I do not need to concern myself with that.

The only downside of using email to reply is that the text is pasted verbatim.
This means Markdown markup is not applied and manual line breaks from the email
show up in the discussion thread.  This makes my messages very ugly to read for
web UI users.  GitLab can render Markdown from emails just fine, so this is a
GitHub problem.


## Reviewing the code

We first need to somehow check out the contributor's fork locally.  The easiest
way is to use the official [GitHub CLI tool].  We need to add the GitHub mirror
as a remote to the local repository if we have not yet done so.

```sh
git remote add github git@github.com:HiPhish/nvim-cmp-vlime.git
```

This is only necessary once per repository and the name of the remote does not
matter.  Now we can check out the PR.

```sh
gh pr checkout 2
```

Here `2` is the ID of the PR.  This will create a local branch with the code
of the PR.  From here on we can test the code, review the diff and add our own
commits.  In this cases I needed to apply a little correction, so I made the
changes and committed to the PR branch directly.  I also posted a comment to
the discussion thread via email.

Once I was satisfied with the result I merged the PR branch locally to the
`master` branch and pushed the changes to the `origin` remote on GitLab.

```sh
git checkout master
git merge monkoose/master  # This is the name of the local PR branch
git push
````

From here on GitLab and GitHub will take care of the rest.  GitLab pushes the
new commits to GitHub, GitHub detects that the commit from the PR has been
merged, assigns credit to the contributor and closes the PR.


## Conclusion

I can now use GitHub as one of potentially many contribution channels, all from
the command line.  If messages from email would render Markdown properly this
would be perfect.  Maybe I can comment better from the GitHub command line tool
instead, I will have to try that out.  Git was never meant to be tied to one
single web service, and I would like to get off GitLab as well and host my own
server, but for the time being this is good enough.

There is one things I have not tried yet: commenting on a patch.  In the GitHub
web UI you can comment directly on individual lines during code review.  I
wonder if the command line tool can do this. We will find out once someone
opens a new pull request.  Using the CLI tool is an acceptable compromise, even
though I would prefer email, as long as I can push commits to my own upstream
instead of the GitHub mirror.


## Update: Checking out the PR with Git tool only

It has been brought to my attention that using the `gh` CLI tool is not really
"without lock-in".  If you really do not want to use anything from GitHub you
can add the forked repository as a remote and then checkout the feature branch.

```sh
git remote add -f feature-fork git@github.com:someuser/somerepo.git
git checkout --track feature-fork/branch-name
```

From there on everything proceeds as usual.



[GitHub]: https://github.com/
[#2]: https://github.com/HiPhish/nvim-cmp-vlime/pull/2
[GitLab]: https://gitlab.com/HiPhish/nvim-cmp-vlime
[nvim-cmp-vlime]: https://gitlab.com/HiPhish/nvim-cmp-vlime
[GitHub mirror]: https://github.com/HiPhish/nvim-cmp-vlime
[GitHub CLI tool]: https://cli.github.com/
