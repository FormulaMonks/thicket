# A tale about dragons and Cataluña

Last October a planned independence referrendum was about to take place: Catalonians were going to choose whether or not they would continue to be part of Spain or undertake their own autonomous governance. Spain's central government had other plans; disruption would take over.

On the days prior to the event some measures where taken: on Wednesday morning, police entered the offices of the `.cat` internet registry's headquarters in Barcelona and seized all of its computers. They arrested six members of the staff and held four of them for two days. Finally the **CTO** was accused of sedition.

Them, [the Catalan government used IPFS to sidestep Spain's legal block](http://la3.org/~kilburn/blog/catalan-government-bypass-ipfs/).

We'll come back to this.


## Our mission

We decided to build a _decentralized app_ where users could shoot _GIFs_ and share them with their peers. A _decentralized app_ meant we aimed at avoiding servers that would hold authority over the generated content and that the users would maintain ownership of their creations.

We found communities, platforms, tools and other resources for such a mission. One of such networks is called [IPFS](https://ipfs.io).

From its overview section in the [IPFS](https://github.com/ipfs/ipfs) repo at Github:

>IPFS (the InterPlanetary File System) is a new hypermedia distribution protocol, addressed by content and identities. IPFS enables the creation of completely distributed applications. It aims to make the web faster, safer, and more open.
>
>IPFS is a distributed file system that seeks to connect all computing devices with the same system of files. In some ways, this is similar to the original aims of the Web, but IPFS is actually more similar to a single bittorrent swarm exchanging git objects.

This seemed like a good place to start out. We would integrate the `js-ipfs` library into our stack. We decided to use `create-react-app` which under the hood uses _React_, _Webpack_ and _Babel_.


## "Beware of the dragons"

Reads the **project status** section of [IPFS.JS](https://github.com/ipfs/js-ipfs). They declare their software is in _Alpha_ stage with "lots of development happening". Dragons are mythological creatures. I was named after [Saint George](https://en.wikipedia.org/wiki/Saint_George) who slayed dragons and my colleague [Chad](https://github.com/chadoh) is interested in "illegal fictions". We were not going to be scared away because of a warning from a couple of rendered bits.

Our journey took us to understand one of the main foundations of developing _decentralized apps_: content is not uploaded to a server where it will later on be distributed. Instead, it should be stored and served directly in and from the user's device. This meant we had to store the generated files within the client's browser and then find a way to make them accessible to the rest of the world.

`ipfs-js` offers an abstraction layer to interact with the IPFS network. It includes a module (`files`) that exposes an interface to `add/retrive` files to/from the IPFS network. After a file has been successfully added to the network, the library returns a unique _hash_ to the operation. This _hash_ represents the file in the network and can be used to retrieve it from any IPFS gateway:

```
https://ipfs.io/ipfs/HASH
```

We coded our process into adding our files into the IPFS network, received unique _ids_ for the files and started rendering the images into our Webapp. We felt very happy, our code was working and we thought we were ready to continue building new features but then we discovered a problem: our build script was failing.

This is the ouput we received:

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


## Our dragon: the build process

The shortened url redirected us to:[ npm-run-build-fails-to-minify](http://bit.ly/2tRViJ9) with the following:

>You may occasionally find a package you depend on needs compiled or ships code for a non-browser environment. This is considered poor practice in the ecosystem and does not have an escape hatch in Create React App.
>
>To resolve this:
>
>Open an issue on the dependency's issue tracker and ask that the package be published pre-compiled (retaining ES6 Modules). Fork the package and publish a corrected version yourself. If the dependency is small enough, copy it to your src/ folder and treat it as application code.

Apparently we were using a dependency that wasn't browser friendly.

It wasn't clear to us how to proceed but in order to continue with our project we had to make sense of what was going on. We looked up the error and found a Github [issue](https://github.com/ipld/js-cid/issues/38)) that pointed us in the right direction. The issue referenced the following error:

```
Webpack bundle failing at CID: Unexpected token: name (CID)
```

This error was different to ours (we would find this same error later on) but reading the whole comment thread on the issue, we found a couple of ideas that would kickstart our search for a solution.


## How to slay a dragon

Our stack included `create-react-app` which provided the `build` process for us. The `build` script uses _webpack_ and one of the steps in the `build` process in the setup _minifies_ the source code. The library used to _minify_ is `Uglify version 2`. This library does not _minify_ code written in `es6` syntax.

The first error we had encountered was happening because our dependency's source code was written in `es6` syntax and the _minify_ library wasn't able to work with such code.

We used a script to _transpile_ the dependencies that had their source code written in `es6` syntax and this helped our `build` process to succeed. We then tested our app and found another error (the one referenced at the github issue: `Webpack bundle failing at CID: Unexpected token: name (CID)`. Further research led us to understand that some IPFS libraries implement a check against an object's `class` name. `Class` names get overwritten in `minify` processes thus such checks would fail.

In order to solve this we had to `eject` the `create-react-app` tool. The `eject` process removes the tool itself and provides suitable fallbacks for the development scripts (we were interested in the `build` script). Once we _ejected_ the tool, we had to tweak the _webpack_ configuration file and remove the `minify` step.

Removing the `minify` step from the `build` process worked but itt came with a major drawback: our built bundle doubled in size. Yet, the app works.

We also tried to use the latest version of the _minify_ tool (`Uglify 3 version`) before removing the step itself but it made no difference. The `class` name was being overwritten too and the check mentioned before failed.


## The two headed dragon

During our whole research and struggle with the beast something came our way, another error had been appearing in our consoles:

```
Mixed Content: The page at 'PUBLIC_URL' was loaded over HTTPS, but attempted to connect to the insecure WebSocket endpoint 'ws://star-signal.cloud.ipfs.team/socket.io/?EIO=3&transport=websocket'. This request has been blocked; this endpoint must be available over WSS.
```

We found out we were dealing with a two headed monster! We tried some quick hacking but nothing. We had wounded the creature but it had resurrected. There were whispers of dragons being able to heal themselves, even of being able to grow a new head when one is cut.

We started to feel our app wasn't working as before. We felt it was slow. Our content would take more time to show up, took more time to show up in our peers's devices. Then we found this: https://github.com/ipfs/js-ipfs/issues/1029#issuecomment-331873395.

We applied the suggested solution and the beast finally surrendered. Maybe this is what happens when you deal with the unknown.


### Epilogue

The second error we encountered did not cause the app to stop working. We felt it was not working because the IPFS network became almost unresponsive and the error kept showing in our consoles. It was odd, and it became even stranger when we felt the same sluggish sensation trying out code from a previous working version.

This was all happening at the same time as the Cataluñan government was about to go through with their independence referendum and their internet registry's office had been shut down. This is when the Cataluñan government started using the IPFS network. But the network was not ready for a spike in nodes (reference [here](https://discuss.ipfs.io/t/ipfs-daemon-is-eating-up-all-the-resources-on-my-computer-what-is-happening/1241/2)).


### IPFS, their network and tools are a work in progress.

>Performance improvements are being actively developed, but these things take time.

We were very happy to see how these tools can help in real situations happening right now in the world but there is more work to be done. We hope our tales of the journey through the difficult `build` process with the `js-ipfs` library, `create-react-app`, `webpack` and `uglify` encourages others to try out this new technologies.
