# 16 apps you might find in a Decentralised app store node by mid 2018

For some of us, trying to picture the future is a daily activity; some days lead into ideas that should not be pursued and other days help guide the present into expressions of what the world can be. Citrusbyte is a thought-leader in both software engineering and design, and as part of our work we commit ourselves to research experiments with cutting edge technologies.


## Building the future

> Computer science is all about creating good abstractions. Good abstractions are all about presenting a view of the world that can be used.

This past September, my team at Citrusbyte embarked on a research project into decentralised applications. We set our goal to build a decentralised clone of Vine - the GIF sharing app. We started out from scratch, coding small, step-by-step sized features one at a time. We refactored once the new concepts where settling in our minds and came up with new concepts of our own.

You can read more on our mission to evaluate the maturity of IPFS’s network, how we weighed strategies for building decentralised apps and the problems we ran into here: [The state of frontend development with IPFS in 2017](http://bits.citrusbyte.com/the-state-of-frontend-development-with-IPFS-in-2017/).

The following concepts give context and scope to the apps in the list.

### Private IPFS swarms

IPFS works in a _P2P_ fashion. When an IPFS node is executed it reaches out to several [_signaling servers_](https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/). These servers help the node find & connect to other IPFS nodes. By removing the IPFS default signaling servers configuration a node will not be able connect to any other node. Then, by configuring the node to reach out to a custom signaling server we can control which nodes it connects to. This way we can achieve a private swarm of IPFS nodes which will include all the IPFS protocols & tools. Any type of authentication layer can be integrated into the signaling server (SSH keys, JWT tokens, HTTP credentials, etc) to control which nodes can connect to it. This last step does not provide a decentralised identity layer but can work out of the box for SSO (Single Sign-On) services.


### Shared Resources

While we were working on our decentralised app, we came up with the concept of _Community_. For us a Community represents a group of members that share resources to benefit the group. In our app, the swarm of interconnected nodes share their independent resources back with the Community. Each node in our app shares disk space and bandwidth with all the Communities the user has joined. Users create and post GIFs to their Communities and every other member of the Community replicates such GIFs by downloading and storing them locally. Then the nodes help redistribute the GIFs data to ndoes who join the Community - under the hood this works in a similar way to torrent file distribution.

By leveraging the independent resources in the swarm of interconnected computers it is possible to distribute tasks amongst them. The computational power of the whole network can be used for tasks that require the extra power. Picture the IPFS private swarm acting as a botnet, all nodes can receive commands in real-time and execute them - an appropriate layer of command hierarchy should be implemented to avoid misuse.


### CRDT ([`Conflict-free Replicated Data Type`](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type))

Interconnected nodes in an IPFS swarm can maintain a shared data structure. This data structure can receive modification events like adding new data, removing data and modifying existing data. In order to be able to normalize the data state between all the nodes we looked into tools that treat the data structure as an _append only log store_. This means that changes can occur independently and processed serially to reach the current state of the data. Data can receive updates while in offline mode and then be merged once the node reconnects.

To maintain data consistency between the interconnected nodes in our app, we used [`YJS`](https://github.com/y-js/yjs). It gave us the freedom to collaborate on shared data structures without having to normalize them every time any node updated the data. Changes are automatically broadcasted and there is no need to figure out who did what and in what order to keep the data consistent. It also gave us the ability to work offline and to merge updates into the shared data once the node reconnected to the network out of the box.

The following Dapp ideas benefit from the use of IPFS's prtocols and tools and implement one or more of the concepts described above.


## The Dapps

1. *Decentralised file collaboration and file sharing app with offline functionality.* A decentralised Google Docs + Dropbox. Allow real-time collaboration on docs and be able to share them easily by storing them directly in your file system. Work offline and then merge your updates when connected. If there are conflicts, branch of directly. Share files any way you want, and by adding them to your _selected folders_ the network will replicate and distribute them - meaning, you can access your files even if your computer is turned off.
2. *Distributed password manager.* Once encrypted passwords will be replicated, distributed and ready for retrieval from any node connected to the network. No need to keep your machine turned on.
3. *Distributed Wikipedia* Want to help out Wikipedia? How about sharing disk space and bandwidth in order to replicate content and redistribute it? Once you access any content on Wikipedia you can be part of the network of nodes helping keep the costs down and the uptime, well, up. This works for different languages too, you read Wikipedia in English, then you'll be helping with that specific content. Read it in any other language and you'll be doing the same thing.
4. *Distributed package management* Never let one person break the Internet again. With a decentralised network of nodes accessing distributed git repos and building the software, then the built packages will be ready for download on demand. Once a built packages is added and replicated it doesn't matter if the author turns their machine off, the package will persist in the network and ready to be downloaded.
5. *Distributed botnet + command center* A network of machines interconnected to each other ready, listening to events? We can turn those events into commands. Need some extra power for some computations? Distribute the tasks between the peers and wait for their responses. In exchange, your machine will also await for commands and execute them when needed.
6. *Distributed continuous integration* We've seen how testing doesn't scale. Does having to run tests in series for a long time ring a bell? Does it get worse every time new features increase the number of tests? Bottleneck. Distribute the tests via the network of peers, let each node execute part of the total and return the result. There is a double gain here: run tests in parallel and distribute the workload.
7. *Distributed containers* With distributed computing a network of nodes can execute tasks on demand, why not execute apps on demand too? Run any container in a distributed network. Piture this as having a decentralised EC2.
8. *Distributed video analysis for augmented reality* One type of augmented reality applications involve reading from an input source (usually video) to find objects and relate them to metadata. Imagine an application that receives input from any movie and can in real time recognize the actors and fetch data from IMDB and display the information in real time. This type of applications would rely on different processes reading from the input source and publishing events whenever a match occurs.In a distributed network (private or not) nodes can take on individual tasks thus delegating the workload throughout all the network. Whenever one of the peers reaches a goal, using the experimental pubsub features of the IPFS network the event can be broadcasted and business logic can be applied.
9. *Private networks for massive events* Connecting to the Internet during massive events in countries like Mexico, Argentina and Spain is an impossible task. By introducing a custom network, companies can provide their users with the full capabilities of real internet applications. The network can deliver those applications, users can execute them directly in their devices (similar to offline mode) and take further actions if needed once the users can connect online. Furthermore, the network can use the replicate & redistribute capabilities of the network to provide realtime events to all the connected users.
10. *Private networks events with low or no connectivity* Connecting to the Internet during massive events in countries like Mexico, Argentina and Spain is an impossible task. By introducing a custom network, companies can provide their users with the full capabilities of real internet applications. The network can deliver those applications, users can execute them directly in their devices (similar to offline mode) and take further actions if needed once the users can connect online. Furthermore, the network can use the replicate & redistribute capabilities of the network to provide realtime events to all the connected users.
11. *Global ranking system* It is possible to offer a decentralised ranking service using the IPFS network. The idea is to leverage append only logs where users are given a rank level in the network.
Rather than receiving points and having to compute the new state of the leaderboard every time an event takes place, users can trade ranking spots (similar to trading cryptocurrencies). Imagine this ranking structure in a way that a user “owns” the Nth ranking spot and whenever an event occurs the spot is exchanged.
12. *Decentralised video sharing app* A distributed swarm of computers can excel and distributing large files. With an optimized content distribution strategy, IPFS can deliver rare pieces of content over more common ones, making it easier to seed even incomplete files thus benefiting the whole network. Aim this at video, and improve the experience.
13. *Decentralised maps/cartography app* Decentralised maps with real time updates from nodes. Imagine receiving the traffic updates directly from nodes and having the network distribute all this data. No central point of failure and less chance of getting directions into wild fires.
14. *Distributed software distribution* Decentralised software distribution. Need an app? Get it from the closest node to you. Upload your changes and let the network to broadcast the changes and the nodes that are interested can download thenm accordingly.
15. *Peer to peer content sharing network* Any type of content can benefit from IPFS's optimized content distribution strategy. Share any type of file, share JSON documents that refer to any other type of file and maintain the files ready to be fetched even when the original author is not online.
16. *Enterprise for any of the above* With private swarms a controlled network can include any option from above (and maybe mix them up), put that in a box and ship it out. Any company can use their existing infrastructure to integrate any and all of the distributed/decentralised ideas from the list.

## Where do we _fork_ from here?

There is a big trend going on of _"X company with Blockchain"_ type of ideas, still there are a lot of concepts that need to be fully understood, questioned and worked out before the tipping point is reached and Dapps go mainstream. We identified some problems that need to be solved before full delivery of the Dapps in the list is reached. These problems include:

- Authentication
- Disk space optimization
- Distributed consensus
- P2P video streaming

We also identified categories of Dapps that can be worked upon and that could start out from a fork of the work we did. These categories include:.

- Apps that use collaborative editing on shared data/documents.
- Apps that create & post or find & share content with other users.
- Apps that share disk space usage and that can benefit from  P2P redistribution of content.

Let us know what other distributed Dapp ideas come to mind. We came up with this list after working with the technology and after we understood its inner ticks. We know this type of protocols & tools will help with problems that haven't yet being discovered.
