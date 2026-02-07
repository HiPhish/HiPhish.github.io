---
title: Securing Quicklisp through mitmproxy
tags: lisp, web, network
category: open-source
---

[Quicklisp] is a popular systems manager for Common Lisp, it allows users to
download, install, update and uninstall Common Lisp systems (what other
language call packages, but that term already means something else in Common
Lisp). However, Quicklisp has one glaring security issue: it downloads
everything through HTTP. This means every time you use Quicklisp to download a
system you open yourself up for a man-in-the-middle (MITM) attack. We can use a
local proxy server to route all traffic to Quicklisp through HTTPS, and in this
blog post I will illustrate how to achieve this using [mitmproxy].

The process will work for any proxy server application, mitmproxy is simply the
one I have used. It should be easy enough to port these instructions to your
personal proxy server of choice.

TL;DR: Run mitmproxy as `mitmproxy -p 8080 -M '/^http:/https:'` (or whatever
port you prefer), then install Quicklisp with `http://localhost:8080`
(substitute your own port). Have the proxy running every time you want to
download from the internet.


## The problem

Whenever we send an HTTP request over the internet the data is bounced around
between network nodes until it eventually reaches its destination (hopefully).
During this process the data is not encrypted, it is transmitted as clear text.
Any of the intermediate nodes can intercept the data, read it, and even modify
it with the recipient being none the wiser. The is called an MITM attack.

In the case of Quicklisp we are transmitting executable code. Since we are
transmitting source code, an attacker could easily inject malicious code
without compromising the system's functionality. Your code would work as
expected while doing something malicious in the background.

HTTPS solves this issue by enforcing end-to-end encryption. The data travels
encrypted over the internet and only the recipient can decrypt it. Even if an
attacker were to intercept the data he would not be able do anything with it.
If the attacker were to swap out the data we would be able to detect the
certificate mismatch (assuming the server's certificate has not been
compromised). HTTPS is not a perfect solution, but it does reduce the attack
surface significantly.

Fortunately the Quicklisp servers themselves do support HTTPS, so all we need
is to get the Quicklisp client to speak HTTPS.


## The solution

If MITM attacks are the problem, then perhaps MITM attacks are also the
solution? We can perform an intentional attack on ourselves: intercept any HTTP
request, send out an equivalent HTTPS request, intercept the server response
and pass it on to the client over HTTP. The important part is that the proxy is
not on the internet. Ideally it should be on the same machine as Quicklisp, but
it is enough for it to be inside a trusted network.

Let's get to it. Install and set up mitmproxy, then start it up and instruct it
to match HTTP requests.

```sh
mitmproxy -p 8080 -M '/^http:/https:'
```

The `-p` option tells it which port to listen to, with `8080` being the
default. You may want to change the port to something you don't use often. The
`-M` option consists of a Python regular expression to match (`^http:`), and a
substitute (`https:`).

Now start up the Quicklisp installer script and install Quicklisp, specifying
the proxy server.

```lisp
;;; Install Quicklisp
(quicklisp-quickstart:install :proxy "http://localhost:8080")

;;; Let's try installing a system
(ql:quickload "vecto")
```

Quicklisp will remember its proxy settings, there are no extra steps to
perform. As long as there is a proxy setting you will not be able to download
anything when the proxy server process is not running, so you will not be able
to download data without protection by accident.


## Do I have to do this every time?

Well... sort of. If a system has been installed you can `quickload` it without
a proxy running, but you need the proxy if you wish to download more systems or
update the existing systems. It is annoying, but realistically speaking, how
often do you actually download systems?

There are two solutions I can think of:

- Have your Lisp implementation start up the proxy server
- Patch Quicklisp

The former should be doable; you already have a configuration file which is
most likely in Common Lisp, so you could use it to start a separate process
with the server. But then you have an entire server process running parallel
the entire time, and if you start REPL instances you will need to make sure
they don't step on each other's toes.

You could have the OS start up the proxy server process instead. If you have
other applications you want to reroute this way as well it could be worth the
overhead, and you would not have to bloat your Common Lisp startup script.

Patching Quicklisp to always use HTTPS would be a better solution, but it is a
hard problem. Quicklisp has no external dependencies so it can easily be
bootstrapped. If we wanted to use Transport Layer Security (TLS) we would
either need a TLS library or limit ourselves to Common Lisp implementations
that include TLS support (I do not know if there even are any). If we were to
use a library, how would we pull it in? Vendor it? Rely on a system library?
And if so, how do we interact with it when there is no standard native
interface? We could use the [CFFI] library, but how do we pull in that one? And
don't even think about implementing TLS as part of Quicklisp; you never roll
your own crypto unless you really know what you are doing.

A good compromise would be to first install Quicklisp the way I have outlined,
then install a TLS patch for Quicklisp that pulls in all its dependencies. We
would still need to bootstrap Quicklisp securely the hard way, but once we have
an initial secure connection we can safely pull in any dependencies we need.

I should also mention an alternative systems manager called [CLPM]. It supports
HTTPS out of the box, but it has around a hundred dependencies which are all
vendored. Vendored dependencies are convenient, but the big problem is that now
the CLPM maintainer has to keep every single dependency up to date for
security. The problem can be avoided by managing the dependencies through
another package manager instead, such as the system package manager. But good
luck getting a hundred Common Lisp packages into any systems repository though.


## Thoughts on security

Downloading packages through HTTPS does not guarantee that the code we download
is actually safe. There are still two points of attack:

- The original autor
- Quicklisp

That being said, it is much easier to audit two fixed potential points of
failure, especially if those points of failure have a reputation to lose, than
an arbitrary number of anonymous points of failure.

I understand that adding TLS to Quicklisp is a hard problem, and perhaps there
is a better solution to the security issue. However, I think that not
disclosing this vulnerability front and center on the Quicklisp website is a
gross misstep, especially if it is this easy to retrofit a solution. In fact, I
would have gone so far as to require a proxy during installation unless the
user has explicitly specified `:proxy nil` just to be on the safe side and make
the unsafe behaviour opt-out rather than make the safe behaviour opt-in.


[Quicklisp]: https://www.quicklisp.org/beta/
[mitmproxy]: https://mitmproxy.org/
[CFFI]: https://cffi.common-lisp.dev/
[CLPM]: https://clpm.common-lisp.dev/
