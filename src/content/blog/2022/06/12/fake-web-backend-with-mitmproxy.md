---
title: Fake web backend with mitmproxy
tags: web, network
category: open-source
---

A web application typically consists of three layers: the frontend, the
backend, and some sort of database system for persistence. While developing the
frontend we often need to send messages to the backend, receive some response
and process that response. Faking backends in automated tests is a solved
problem, but sometime we don't want to write tests, we want to wildly
experiment with various inputs as we are trying out the frontend by hand. We
want to intercept messages and look into what is being transmitted. In this
post I will demonstrate a simple fake backend using the [mitmproxy]
application.


## The problem

Suppose we have a web server application running somewhere. The server hosts a
frontend website which the user can visit. The user interacts with the website,
e.g. by filling out a form and clicking a button. Then the frontend sends an
HTTP request to a backend server, which processes the message and does
something (usually by sending back a response).

```
┌─────────────────┐        ┌────────────────┐        ┌──────────┐
│ Frontend server │        │ Backend server ├────────┤ Database │
└────────┬────────┘        └─────────┬──────┘        └──────────┘
         │                           │
         │       ┌──────────┐        │
         └───────┤Frontend  ├────────┘
                 └──────────┘
```

Frontend and backend may by distinct server processes or they may be the same
process, it does not matter. The frontend server is irrelevant to us here
anyway. We want to have exact control over what the backend will return, but
the backend is an actual application with its own logic. It will return
whatever its logic dictates. When we want a certain result we would first have
to figure out what input generates that particular result, or we would have to
temporarily patch the backend to always return the desired result. 

A fake backend simplifies our workflow, we can connect to it from the frontend
instead of to the real thing.


## The solution

### A naive interceptor backend

For now let's assume the backend listens to port 6000. In that case all we have
to do is start mitmproxy to listen to port 6000 as well.

```sh
mitmproxy -p 6000
```

That's it, now it will intercept messages, allowing us to inspect them. Of
course it won't know what to do with them and we will not be able to send any
responses back.

### A backend with logic

Mitmproxy can be scripted in Python. We can use this to write a simple script
which looks at the request, looks up a canned response somewhere, and
sends that response back.

#### A toy addon

An addon is an instance of a Python class which is added to the list of addons.
Here is a basic example from the official documentation:

~~~python
from mitmproxy import ctx


class Counter:
    def __init__(self):
        self.num = 0

    def request(self, flow):
        self.num = self.num + 1
        ctx.log.info("We've seen %d flows" % self.num)


addons = [
    Counter()
]
~~~

The `ctx` object is a global variable which holds the current state of
mitmproxy. The example is self-explanatory, we keep an internal counter inside
the instance and increment it every time a new request arrives. The `request`
method is an event *hook*, its implementation specifies what will happen when a
request arrives. The documentation has a list of all available hooks. The
`flow` argument is an object which encapsulates the HTTP transaction. Here the
`flow` is not used, but we will need it later.

We can add our new addon by passing the file path as a command line argument to
mitmproxy:

~~~sh
mitmproxy -p 6000 -s ./counter.py
~~~

#### A fake backend addon

We want to send a request back, so for starters let's always send back the same
response. For brevity I will from now on only list the addon class, not the
`import` statements and the `addons` assignment.

~~~python
class DummyBackend:
    def request(self, flow: HTTPFlow):
        response = Response.make(
            200,
            content=json.dumps({'message': 'Hello world'}),
            headers={'Content-Type': 'application/json'}
        )

        flow.response = response
~~~

We take a Python dictionary, convert it to a JSON string and assign it to the
`response` property of the `flow` object. So far so good. Now we need to
generate a response based on the actual request. For simplicity we will be
using a Python dictionary where the path of the request is the key and the
value is the canned response.

~~~python
responses = {
    'POST': {
        '/user': {'success': true, 'errorCode': None}
    },
    'GET': {
        '/user': {'firstName': 'John', 'lastName': 'Doe'}
    }
}

class DummyBackend:
    def request(self, flow: HTTPFlow):
        method = flow.request.method
        # Strip off anything after the query
        path = re.match(r'^[^?]*', flow.request.path)[0]

        try:
            result = responses[method][path]
            response = Response.make(
                200,
                content=json.dumps(result),
                headers={'Content-Type': 'application/json'}
            )

            flow.response = response
        except KeyError:
            ctx.log.error(f'No canned response for {method} {path}')
            flow.response = Response.make(
                404,
                content=b'Path not found',
                headers={'Content-Type': 'text/plain'}
            )
            pass
~~~

Of course a real web API would have more complicated request formats and it
might require some splitting, iteration and concatenation to generate a valid
response, but the base idea is the same. Here are some ideas for where to go
next:

- Store the responses outside the script, e.g. in a JSON file
- Take the query or path parameters into account
- Add an option to change the data file on the fly


## A complete fake backend

Here is a complete backend which implements the above ideas.

~~~python
import json
import re
from pathlib import Path
from mitmproxy import ctx
from mitmproxy.addonmanager import Loader
from mitmproxy.http import HTTPFlow, Response


class DummyBackend:
    def __init__(self):
        self._mtime = 0  # Last time the JSON file has been modified

    def load(self, loader: Loader):
        "Adds an option inside mitmproxy to change the JSON file."
        loader.add_option(
            name='responsesfile', typespec=str, default='responses.json',
            help='Path to JSON file with canned responses (relative to working directory)')

    def request(self, flow: HTTPFlow):
        "Intercept HTTP requests and provide a response"

        if self._is_stale_datafile():
            self._read_datafile()

        method = flow.request.method
        # Strip off anything after the query
        path = re.match(r'^[^?]*', flow.request.path)[0]
        try:
            response = self._responses[method][path]
            flow.response = Response.make(
                200,
                content=json.dumps(response),
                headers={'Content-Type': 'application/json'}
            )
        except KeyError:
            ctx.log.error(f'No canned response for {method} {path}')
            flow.response = Response.make(
                404,
                content=b'Path not found',
                headers={'Content-Type': 'text/plain'}
            )

    def _read_datafile(self):
        self._mtime = self._datafile.stat().st_mtime
        with open(self._datafile, 'r') as infile:
            self._responses = json.load(infile)

    def _is_stale_datafile(self):
        "Whether the JSON file has been changed since the last time."
        mtime = self._datafile.stat().st_mtime
        return mtime > self._mtime

    @property
    def _datafile(self):
        "Path to the JSON file, read from an option in mitmproxy"
        return Path(ctx.options.responsesfile)


addons = [DummyBackend()]
~~~

This fake backend will retain the dictionary of responses in memory, but it
will also check every time whether the responses file as been changed and
reload it. That way I can change my canned responses without restarting
mitmproxy.


## Conclusion

We can write addons for mitmproxy in Python. These plugins are implemented as
classes which implement the event hook methods for events which we are
interested in. We can intercept a request and provide it with a canned
response, generated inside the Python script.



## Further reading

- [mitmproxy website](https://mitmproxy.org/)
- [mitmproxy documentation](https://docs.mitmproxy.org/stable/)
- [Writing addons](https://docs.mitmproxy.org/stable/addons-overview/)


[mitmproxy]: https://mitmproxy.org/
