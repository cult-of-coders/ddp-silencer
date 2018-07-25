# DDP Silencer - Fusion Mode

This package is an extension to `ddp-client`, originally from Meteor, with the ability to conditionally start the DDP connection.

Original code: https://github.com/meteor/meteor/tree/devel/packages/ddp-client

## Why ?

The reason is simple, websockets are expensive, and most applications won't need it. Or they need it in certain areas, this opens the path of doing so with ease. Or, you're working with Apollo, and you're already using Apollo's websockets for subscriptions.

## How to install

```bash
# In your Meteor App
mkdir packages
cd packages
git clone https://github.com/cult-of-coders/ddp-silencer.git ddp-silencer
```

In production make sure you start it with the `DISABLE_WEBSOCKETS` environment variable set:

```
DISABLE_WEBSOCKETS=true meteor run
```

Note that by default DDP is not engaged in production, set the `DDP_AUTOENGAGE` to true as environment variable.

The reason for this is that you should no longer rely on DDP for anything. This package just silence it out so you receive no warnings or errors in production, and ofcourse the option to use methods while not having DDP activated.

It's not on atmosphere because we needed to override the behavior of `ddp-client`.

If you add this package to Meteor, the client no longer requires an websocket connection. This means that subscriptions will not work out of the box.
However you can start/stop the websocket conditionally:

```js
import { DDP } from 'meteor/ddp-client';

DDP.engage(); // establishes WS connection
DDP.disengage(); // cuts the WS connection
```

And for your convenience we also export the `Fusion` class that lets components request an websocket connection,
and they can release that connection when no longer needed, and if there is no active "requesters" the websocket connection stops.

Sample:

```js
import { Fusion } from 'meteor/ddp-client';

const handler = Fusion.engage(() => {
  Meteor.subscribe('xxx');
});

// When you no longer need it:
handler.stop();
```

When all registered handlers are stopped, the websocket connection also stops.

`Meteor.call` will work as expected inside your client, because we create a server side route "/\_meteor" that accepts RPC calls.
When DDP is engaged, `Meteor.call` will communicate via DDP

When sending HTTP RPC calls authorization is supported by default, meaning you can still use `this.userId` inside your methods.
This is possible because we pass `Accounts._storedLoginToken()` to each request.

This works with `accounts-password`.

## License: MIT
