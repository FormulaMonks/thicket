# A tale about dragons and Catalonia

The time: September 2017.

The place: Barcelona, a city I moved to in April.

On 1 October, a planned independence referendum was about to take place: Catalonians were going to choose whether or not they would continue to be part of Spain or undertake their own autonomous governance. Spain's central government had other plans. Disruption would take over.

<img src="https://raw.githubusercontent.com/citrusbyte/thicket/master/packages/thicket-publications/posts/dragons-and-catalonia/police-censorship-during-the-catalonian-referendum.jpeg" alt="Police censorship during the Catalonian referendum" height="400px" />

On the days prior to the event some measures where taken: on Wednesday morning, [police entered the offices of the `.cat` internet registry's headquarters](https://overcast.fm/+I0hxSIOgs) in Barcelona and seized all of its computers. They arrested six members of the staff and held four of them for two days. Finally the CTO was accused of sedition.

Then, [the Catalan government used IPFS to sidestep Spain's legal block](http://la3.org/~kilburn/blog/catalan-government-bypass-ipfs/).

We'll come back to this.


## Our mission

Meanwhile this past September, my team at Citrusbyte embarked on a research project.

We wanted to build a _decentralized app_ where users could create GIFs and share them with friends. Decentralized Apps can also be called _Distributed_ Apps, which people refer to as "Dapps."

What is a Dapp?

<img src="https://raw.githubusercontent.com/citrusbyte/thicket/master/packages/thicket-publications/posts/dragons-and-catalonia/centralized-decentralized-distributed.jpg" alt="Centralized, decentralized and distributed" height="400px" />

As explained in [my coworker Chad's talk](https://www.youtube.com/watch?v=FXhPBiv4Roo&list=PLe9psSNJBf743rgLMRVKytyQkDUolnZnY&index=24), a Dapp is an app that works in the most extreme network conditions. Apps built in this way would even work on a future Mars colony!

What exactly is decentralized about them? Two things: _Data_ and _Compute_.

* **Data**: Rather than storing all of your data on one company's servers, and always fetching all of that data from said company, Dapps allow you to store your own data, or to fetch it from whoever already has it nearby.
* **Compute**: Rather than using one company's "cloud" for doing data processing, transactional logic, and other computation, Dapps make use of emerging new networks that don't rely on the goodwill and stability of any single actor, but instead leverage the computing resources of the entire network.

For our GIF-based research, we planned mostly to explore the _Data_ side of building a Dapp. We especially wanted to explore that protocol mentioned above, _IPFS_&mdash;the _InterPlanetary File System_.

Our design goals:

1. Build an app that runs in the browser, and requires no downloads
2. Store all data locally, on users' individual machines
3. Broadcast data directly from one user to another, with no servers intermediating

The second design goal clearly marks this project as _research_&mdash;we expect the data used by our website to grow too quickly for this storage strategy to be practical for a consumer app. Long-term, there are ways to work around this problem&mdash;we could offer users the opportunity to back up their own data on a device plugged into their home router, or we could allow them to pay other people to store their data on the IPFS network using Filecoin. But those sorts of long-term solutions aren't ready yet, and are outside the scope of our research.


## "Beware of the dragons"

What is IPFS, anyway?

There's a lot to say, and [they'll tell you about it better than we can](https://ipfs.io/). But to start out, it's important to understand that IPFS is a new _protocol_. A protocol is not a library; it is not a single tool. Instead, the protocol can be implemented in any language you care to write it in.

The IPFS team's primary implementation is written in Go, a language that would work well on servers or on a desktop via a downloaded app. But per our design goals, we need the whole thing to work in a browser, no downloads required. To this end, we can use `js-ipfs`, a JavaScript implementation of the IPFS protocol which works in Node or in the browser.

IPFS as a whole is still in _alpha_, with known bugs and missing features. And though it is also built and maintained by the core IPFS team, the JS implementation is even less mature than the Go implementation. On [the Project Status section of their README](https://github.com/ipfs/js-ipfs/blob/629d5a7b6f582cab2dc4c6201e8ee73e32673015/README.md#project-status), they say explicitly that there's "lots of development happening" and to "beware of the dragons."

Well! I was named after [Saint George](https://en.wikipedia.org/wiki/Saint_George), slayer of dragons. Bring 'em on!

<img src="https://raw.githubusercontent.com/citrusbyte/thicket/master/packages/thicket-publications/posts/dragons-and-catalonia/saint-george.jpeg" alt="Saint George" height="400px" />

## Our first dragon: the build process

We sprinted out the gate.

* Created a new React app with [`create-react-app`](https://github.com/facebookincubator/create-react-app)
* GIF creation with [`gifshot`](https://github.com/yahoo/gifshot)
* Storing GIF data locally with `js-ipfs`
* Broadcasting GIF data to others using the app with [`ipfs-pubsub-room`](https://github.com/ipfs-shipyard/ipfs-pubsub-room)
* Merge real-time interactions and solve potential conflicts using the library [`YJS`](https://github.com/y-js/yjs)

It was working on our local machines and looking great.

And then: we tried to deploy it.

```sh
$ yarn build
yarn run v1.2.0
$ react-scripts build
Creating an optimized production build...
Failed to compile.

Failed to minify the code from this file:

        ./node_modules/cids/src/index.js:23

Read more here: http://bit.ly/2tRViJ9

error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

The shortened bit.ly url redirected us to [a section of the `create-react-app` README](https://github.com/facebookincubator/create-react-app/blob/1a3017b71774bfe271ac6974f8111fc0390271fb/packages/react-scripts/template/README.md#npm-run-build-fails-to-minify) with the following:

> `npm run build` fails to minify
>
> You may occasionally find a package you depend on needs compiled or ships code for a non-browser environment. This is considered poor practice in the ecosystem and does not have an escape hatch in Create React App.
>
> To resolve this:
>
> Open an issue on the dependency's issue tracker and ask that the package be published pre-compiled (retaining ES6 Modules). Fork the package and publish a corrected version yourself. If the dependency is small enough, copy it to your src/ folder and treat it as application code.

Apparently we were using a dependency that didn't play nicely with `create-react-app`'s `minify` logic.


## How to slay a dragon

As `create-react-app` runs its `build` script to prepare code for a production environment, one of the things it does is use [`UglifyJS2`](https://github.com/mishoo/UglifyJS2) to minify the code&mdash;that is, to make it all as small as possible. The version of `UglifyJS2` that it uses does not understand JavaScript code written in newer `es6` syntax. Only `es5` syntax and older.

Indeed, when we investigated where exactly our build script was failing, it failed on keywords like `class` and `let`&mdash;keywords that only exist in newer versions of JavaScript.

We tried to solve this in two different ways:

1. Transpile all dependencies to ES5 syntax ourselves
2. Remove minification altogether :grimacing:

### Strategy 1: Transpile all dependencies to ES5 syntax ourselves

I thought "Hey, it's probably just one or two libraries that are behaving poorly like this. How long could it take to manually add each one to a script that transpiles each to an older version of JavaScript?"

And I started adding them.

And each time, I'd get a little further. The build process would fail at a different spot. But with the same error.

One add-next-dependency-to-my-list-and-rerun-build-script at a time&mdash;sure each time that this next one would be the last&mdash;I [built up a list](https://github.com/citrusbyte/thicket/pull/36/commits/c010aaeaa36bb9da70076e7d93ad14e9f5d7f854) of 225 files that aren't transpiled correctly! From 52 different dependencies.

We didn't exhaustively investigate all of them, but most of these problem libraries are part of the IPFS ecosystem. It appears that most of these use a tool called [`AEgir`](https://github.com/ipfs/aegir)&mdash;also built by the IPFS team&mdash;for their build process. This would explain why so many of our dependencies fail.

I persevered. 225 problem files later, I got our build script to get past that problem...

...And onto a new one.

```sh
Webpack bundle failing at CID: Unexpected token: name (CID)
```

We had actually come across [a Github issue](https://github.com/ipld/js-cid/issues/38) about this one before, when researching our initial problem. Now we could finally make sense of it.

It turns out that transpiling our dependencies to ES5 wasn't enough. The minification step also removes constructor names, which causes the problems [explained here](https://github.com/libp2p/js-libp2p/issues/65).

So then. Strategy 2.

### Strategy 2: Remove minification altogether :grimacing:

In order to solve this we had to `eject` the `create-react-app` tool.

`create-react-app` wraps up various complex logic related to `webpack`, `babel`, and other tools. It's great. When you run `create-react-app eject`, it stops hiding all that logic. It dumps Webpack and Babel configuration files into your codebase.

This gave us the flexibility we needed to remove minification altogether.

As you might expect, this increased the size of our built bundle by quite a bit. In fact, from 1.5MB to 3.8MB.

But it worked. We can at least _deploy our app_ now.

We didn't like this solution. We tried to avoid it. We tried to use the latest version of the _minify_ tool (`UglifyJS2` version _3_). It would get us around the `constructor` name problem but another one would show up.

We decided to cut our losses, and move on with an unminified build.


## The two headed dragon

<img src="https://raw.githubusercontent.com/citrusbyte/thicket/master/packages/thicket-publications/posts/dragons-and-catalonia/angry-dragon-meme.jpeg" alt="Angry Dragon Meme" />

Perhaps we're being generous with ourselves. Maybe what we just described wasn't so much _slaying_ a dragon, but merely running away from it. Well, we _felt_ like we had slain a dragon!

But just when we thought we were past it, another error appeared in our consoles:

```
Mixed Content: The page at 'PUBLIC_URL' was loaded over HTTPS, but attempted to connect to the insecure WebSocket endpoint 'ws://star-signal.cloud.ipfs.team/socket.io/?EIO=3&transport=websocket'. This request has been blocked; this endpoint must be available over WSS.
```

So, something to do with our app connecting to an insecure WebSocket (`WS`) instead of a secure one (`WSS`).

We found out we were dealing with a two headed monster! We tried some quick hacking, but nothing. We had wounded the creature, but it had resurrected. There were whispers of dragons being able to heal themselves, even of being able to grow a new head when one is cut.

In addition to this error, our app felt slower than it used to! After creating a new GIF and clicking "save", it would take half a minute before it showed up in the list. It would take half a minute to show up on our friend's devices. Why was it so slow? Did it have something to do with this `WSS` error?

Then we found this: https://github.com/ipfs/js-ipfs/issues/1029#issuecomment-331873395. The team at IPFS are constantly updating their code, we probably had _cached_ our IPFS repo settings from an old codebase and that caused the error to appear.

We applied the suggested solution and the beast finally surrendered. Our beleaguered app was working again. We could share GIFs with each other, with no servers in between us.

But it was still slower than it used to be...


## Epilogue

Even when we used an older version of our codebase, from before removing the minification step, it was still sluggish. But... we hadn't changed anything. Why did the app performance change, even with the same codebase?

Back to Catalonia.

Remember at the beginning of this post, when I promised we'd come back to Catalonia? Here we are.

It turns out, the way the Catalan government used IPFS to skirt Spanish censorship had attracted some attention. The IPFS network grew quickly from having about 1000 nodes to having about 6000.

But neither the Go implementation nor the JS implementation are built to deal with this increased scale. At least not yet. [That's coming!](https://discuss.ipfs.io/t/ipfs-daemon-is-eating-up-all-the-resources-on-my-computer-what-is-happening/1241/2)


## IPFS, their network, and tools are a work in progress.

<img src="https://raw.githubusercontent.com/citrusbyte/thicket/master/packages/thicket-publications/posts/dragons-and-catalonia/developer-wip.png" alt="Developer WIP" />
<img src="http://www.newbiepal.com/wp-content/uploads/2016/12/Work_In_Progress-300x269.png" alt="WIP" />

As mentioned in the above-linked forum post:

> Performance improvements are being actively developed, but these things take time.

We were very happy to see how these tools can help in real situations happening, like the Catalonia referendum. But there is more work to be done.

We hope our tale of the journey through the difficult `build` process&mdash;the `js-ipfs` library, `create-react-app`, `webpack`, `uglify`, and the rest&mdash;can help other people experimenting with these technologies. We also hope it might spur library owners to make their tools play more nicely with others in the wider ecosystem.

We encourage others to try out these new technologies. Let us know what dragons you find!
