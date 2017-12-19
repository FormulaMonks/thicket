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

1. **Decentralised file collaboration and file sharing app with offline functionality.** Bring in the best features of file sharing & collaboration tools out there and mix them with distributed technologies while working directly from the user's file system:
    - Select folders to upload and set access rights to them and/or to individual files.
    - Allow real-time collaboration on docs.
    - Include new files simply by copying them to one of the selected folders.
    - Work offline and merge the updates when reconnected.
    - Access files when needed. The network allows to access files even if the author's computer is turned off.
    - Keep files under version control; allowing users to merge updates or to branch out.


2. **Distributed password manager.** Keep an encrypted distributed store of passwords. Available any time - high availability even while the user's computer is turned off. Interconnected nodes will help maintain an always accessible copy of the encrypted data - which can only be accessed by the user holding the master password. Once connected help replicate and distribute other's data.


3. **Distributed Wikipedia.** Every now and then Wikipedia displays banners asking the users for their support. They ask for donations to help out with server and bandwidth costs. With a decentralised infrastructure every user of Wikipedia can help out without having to donate money - they can help out with direct resources. By replicating content and redistributing any user accessing content can take part of a decentralised swarm that can help keep the server costs low and the server uptime high. Simply by accessing content, nodes can automatically download, replicate content and help distribute it to others.


4. **Distributed package management.** One person broke the Internet one day. With the help of a decentralised network of interconnected nodes we can avoid this doomsday events: high availability will ensure a package cannot be removed even if the author decides to turn their computer off. This network can keep cached references of built packages or build them on demand. Once a built package is uploaded it will be replicated and distributed to the whole network:
    - A node requests a package.
    - If the package does not exist any node can fetch it from a decentralised git network and checkout the version that is being requested.
    - Build the package and upload it to the network.
    - The original node receives the package it requested, replicates it and helps distribute it to other users when needed.
    - The network will maintain high availability for such package from then onward.


5. **Distributed botnet + command center.** The previous ideas explored the concept of shared resources. They did so looking at keeping high availability of data by sharing disk space usage and bandwidth resources. The idea here is to explore sharing other resources: computational operations. The interconnected swarm of computers can share data amongst all of them, and with the help of CRDT tools keep this data normalized. What if the data store held _commands/operations_ to be executed. The swarm could effectively respond to events in a real-time fashion and execute high workload in a distributed fashion delegating the operations between the interconnected nodes.


6. **Distributed continuous integration.** A specific implementation of idea #5. This comes from a real world problem: testing environments that don't scale correctly when either the team grows and/or the number of tests grow and this are run in series. New features will increase the number of tests to be run to be able to correctly merge the new features - potentially never-ending and bottleneck. By distributing the tests via the interconnected nodes we can solve both problems. Different strategies can be put into place to define how the network should delegate the tasks; a basic implementation can have each node run one test and return the given result. This way all the tests can be run in parallel and the workload is distributed.


7. **Distributed containers** Another specific implementation of idea #5. Here an interconnected swarm of nodes distributes tasks to the individual nodes; and the nodes execute the tasks they're given. This tasks have the individual nodes execute containers and run apps inside those containers. A high number of nodes in the network can mean any container/app combination can be run at any given moment. Imagine using this type of network to offer cloud services: picture a decentralised EC2.


8. **Distributed video analysis for augmented reality.** One final implementation of idea #5. One type of augmented reality applications involves reading from a video input source and analyze the data for a match given a query - most of the time this can be seen as looking for an object or groups of objects in the video and relating them to some metadata. When a match is found a request for metadata is executed and the response can be embedded on top of the video source. Imagine an application that is reading into any movie and can recognize actors faces, fetch metadata from IMDB and display the given data near the actors face. Now imagine the same application looking for any other matches (cars, animals, books, etc). This type of application can delegate the tasks of finding the different matches to different nodes in the swarm, effectively distributing the workload while having the network benefit from the independent efforts of each node. Whenever a node finds a match the information is distributed to all the nodes, thus all nodes will receive the metadata for the video source while only having to work on independent, smaller tasks.


9. **Private networks for massive events.** Connecting to the Internet during massive events in countries like Mexico, Argentina and Spain is an impossible task. By introducing a custom network, companies can provide their users with the full capabilities of real internet applications. The network can deliver those applications, users can execute them directly in their devices (similar to offline mode) and take further actions if needed once the users can connect online. Furthermore, the network can use the replicate & redistribute capabilities of the network to provide realtime events to all the connected users.


10. **Private networks events with low or no connectivity.** Connecting to the Internet during massive events in countries like Mexico, Argentina and Spain is an impossible task. By introducing a custom network, companies can provide their users with the full capabilities of real internet applications. The network can deliver those applications, users can execute them directly in their devices (similar to offline mode) and take further actions if needed once the users can connect online. Furthermore, the network can use the replicate & redistribute capabilities of the network to provide realtime events to all the connected users.


11. **Global ranking system.** It is possible to offer a decentralised ranking service using the IPFS network. The idea is to leverage append only logs where users are given a rank level in the network.
Rather than receiving points and having to compute the new state of the leaderboard every time an event takes place, users can trade ranking spots (similar to trading cryptocurrencies). Imagine this ranking structure in a way that a user “owns” the Nth ranking spot and whenever an event occurs the spot is exchanged.


12. **Decentralised video sharing app.** A distributed swarm of computers can excel and distributing large files. With an optimized content distribution strategy, IPFS can deliver rare pieces of content over more common ones, making it easier to seed even incomplete files thus benefiting the whole network. Aim this at video, and improve the experience.


13. **Decentralised maps/cartography app.** Decentralised maps with real time updates from nodes. Imagine receiving the traffic updates directly from nodes and having the network distribute all this data. No central point of failure and less chance of getting directions into wild fires.


14. **Distributed software distribution.** Decentralised software distribution. Need an app? Get it from the closest node to you. Upload your changes and let the network to broadcast the changes and the nodes that are interested can download thenm accordingly.


15. **Decentralise state store for Dapps.** Any type of frontend app that uses a store container similar to React's redux or Vue's vuex can implement their store using decentralised tools and have a swarm of interconnected webapps share the same state. Updates will be broadcasted in a real-time fashion and users with low connectiviy can benefit from offline behaviour.


16. **Enterprise for any of the above.** With private swarms a controlled network can include any option from above (and maybe mix them up), put that in a box and ship it out. Any company can use their existing infrastructure to integrate any and all of the distributed/decentralised ideas from the list.

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
