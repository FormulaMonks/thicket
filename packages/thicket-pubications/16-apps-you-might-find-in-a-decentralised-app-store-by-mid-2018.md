# 16 apps you might find in a Decentralised app store node by mid 2018

For some of us, trying to picture the future is a daily activity; some days this can lead into ideas that should not be pursued and other days can help guide the present toward a more desired future. Citrusbyte is a thought-leader in both software engineering and design, and as part of our work we commit ourselves to research experiments with cutting edge technologies.

This past September, my team at Citrusbyte embarked on a research project into decentralised applications. We set our goal to build a decentralised clone of Vine—the GIF sharing app. We started out from scratch, coding small, step-by-step sized features one at a time. We refactored once the new concepts were settling in our minds and came up with new concepts of our own.

You can read more on our mission to evaluate the maturity of IPFS’s network, how we weighed strategies for building decentralised apps and the problems we ran into here: [The state of frontend development with IPFS in 2017](http://bits.citrusbyte.com/the-state-of-frontend-development-with-IPFS-in-2017/).

In discussions, we came up with a large number of ideas for decentralised apps that we don't have time to build ourselves, but would love to see other people build. This post lists out 16 such ideas.


## Key Concepts

![Computer Science](https://s-i.huffpost.com/gen/1378599/images/o-COMPUTER-SCIENCE-facebook.jpg)

> Computer science is all about creating good abstractions. Good abstractions are all about presenting a view of the world that can be used.

The following concepts give context and scope to the apps in the list.

### Private IPFS swarms

IPFS works in a P2P fashion. When an IPFS node is initiated  it reaches out to several [_signaling servers_](https://www.html5rocks.com/en/tutorials/webrtc/infrastructure/). These servers help the node find & connect to other IPFS nodes. By removing the IPFS default signaling servers configuration a node will not be able connect to any other node. Then, by configuring the node to reach out to a custom signaling server we can control which nodes it connects to. This way we can achieve a private swarm of IPFS nodes which will include all the IPFS protocols & tools. Any type of authentication layer can be integrated into the signaling server (SSH keys, JWT tokens, HTTP credentials, etc) to control which nodes can connect to it. This last step does not provide a decentralised identity layer but can work out of the box for SSO (Single Sign-On) services.


### Shared Resources

While we were working on our decentralised app, we came up with the concept of a _Community_. For us, a Community represents a group of members that share resources to benefit the group. In our app, the swarm of interconnected nodes share their independent resources back with the Community. Each node in our app shares disk space and bandwidth with all the Communities the user has joined. Users create and post GIFs to their Communities and every other member of the Community replicates such GIFs by downloading and storing them locally. Then the nodes help redistribute the GIF data to nodes that join the Community—under the hood this works in a similar way to torrent file distribution.

By leveraging the independent resources in the swarm of interconnected computers it is possible to distribute tasks amongst them. The computational power of the whole network can be used for tasks that require the extra power. Picture the IPFS private swarm acting as a botnet, all nodes can receive commands in real-time and execute them—an appropriate layer of command hierarchy should be implemented to avoid misuse. A strategy to maintain trust needs to be implemented since in a distributed swarm there is no control over the independent nodes, and they can potentially not perform the tasks they are given.


### CRDT ([Conflict-free Replicated Data Type](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type))

Interconnected nodes in an IPFS swarm can maintain a shared data structure. This data structure can receive modification events like adding new data, removing data and modifying existing data. In order to be able to normalize the data state between all the nodes we looked into tools that treat the data structure as an _append only log store_. This means that changes can occur independently and be processed serially to reach the current state of the data. Data can receive updates while in offline mode and then be merged once the node reconnects.

CRDT data structures can be used for Backend and Frontend apps. They can even be used to normalize state for a Backend app communicating with a Fronted app. IPFS nodes benefit from this data structures for any type of node, browser or not. It is a data structure to normalize state between webapps or backend apps or nodes (or a mix of all of them) that are accessing and modifying the same data source.

To maintain data consistency between the interconnected nodes in our app, we used [`YJS`](https://github.com/y-js/yjs). It gave us the freedom to collaborate on shared data structures without having to normalize them every time any node updated the data. Changes are automatically broadcasted and there is no need to figure out who did what and in what order to keep the data consistent. It also gave us, out of the box, the ability to work offline and to merge updates into the shared data once the node reconnected to the network.

The following Dapp ideas benefit from the use of IPFS's protocols and tools and implement one or more of the concepts described above.


## The Dapps

1. **Decentralised file collaboration and file sharing app with offline functionality.** Bring in the best features of file sharing & collaboration tools out there and mix them with distributed technologies while working directly from the user's file system:
    - Select folders to upload and set access rights to them and/or to individual files.
    - Allow real-time collaboration on docs.
    - Include new files simply by copying them to one of the selected folders.
    - Work offline and merge the updates when reconnected.
    - Access files when needed. The network allows to access files even if the author's computer is turned off.
    - Keep files under version control; allowing users to merge updates or to branch out.


2. **Distributed password manager.** Keep an encrypted distributed store of passwords. Available any time—high availability even while the user's computer is turned off. Interconnected nodes will help maintain an always-accessible copy of the encrypted data — which can only be accessed by the user holding the master password. When you are connected you will help replicate and distribute other user's data. IPFS offers the tools to store data in a decentralised network. A user that joins the network would receive the swarms data state—somewhat of a hash table referencing users data. Then they could submit their encrypted data and add it to the reference table. When joining from another device, the data can be found using the reference to the hash table, encrypted, thus only the original uploader holding the key to decrypt has access to the actual data.

   Where would the data be physically stored? Every node connected to the network would store and redistribute every piece of information. Only the original uploader holds the key to decrypt their own data, so only they can access it.


3. **Distributed Wikipedia.** Every now and then Wikipedia displays banners asking the users for their support. They ask for donations to help out with server and bandwidth costs. With a decentralised infrastructure every user of Wikipedia could help out without having to donate money—they can help out with computational resources. By replicating content and redistributing it, any user accessing can take part of a decentralised swarm that can help keep the server costs low and the server uptime high. Simply by accessing content, nodes can automatically download, replicate content and help distribute it to others.


4. **Distributed package management.** [One person broke the Internet one day](https://qz.com/646467/how-one-programmer-broke-the-internet-by-deleting-a-tiny-piece-of-code/) and it happened again recently: [some packages disappeared from npm](https://github.com/npm/registry/issues/255). With the help of a decentralised network of interconnected nodes we can avoid this doomsday events: high availability will ensure a package cannot be removed even if the author decides to remove their packages from the repository. This network can keep cached references of built packages or build them on demand. Once a built package is uploaded it will be replicated and distributed to the whole network:
    - A node requests a package.
    - If the package does not exist any node can fetch it from a decentralised git network and checkout the version that is being requested.
    - Build the package and upload it to the network.
    - The original node receives the package it requested, replicates it and helps distribute it to other users when needed.
    - The network will maintain high availability for such a package from then onward.

   Picture a scenario where there are two nodes connected to this network: Alice and Bob. Alice requests a package and Bob's computer receives the request. Since the packages has not been built, Bob's computer fetches the required files from the corresponding git repository (be it Github or a similar decentralised hub). Once it has cloned the repo, Bob's computer runs the `build` script on the files and uploads the corresponding built files to the network via IPFS. Bob's computer receives the hash corresponding to the newly built files and sends it back to Alice. Alice now has access to the required package and her computer downloads the file and helps redistribute it.
Charlie comes along and joins the network. He requests the same package Alice requested. Either node (Alice's or Bob's) receive the request and now the package has been built, so Charlie receives the corresponding hash, downloads the file and helps redistribute it too.


5. **Distributed botnet + command center.** The previous ideas explored the concept of shared resources. They did so looking at keeping high availability of data by sharing disk space usage and bandwidth resources. In addition to sharing such data, we also had the idea to explore sharing other resources: computational operations. As in the previous ideas, the interconnected swarm of computers can share data amongst all of them, and with the help of CRDT tools keep this data normalized. But then, what if the data store held _commands/operations_ to be executed. The swarm could effectively respond to events in a real-time fashion and execute high workload in a distributed manner, delegating the operations between the interconnected nodes.


6. **Distributed continuous integration.** A specific implementation of idea #5. This comes from a real world problem: testing environments that don't scale correctly when either the team grows and/or the number of tests grow and these are run in series. As the number of features and associated tests grow, the test run length grows with them. By distributing the tests via the interconnected nodes we can solve both problems. Different strategies can be put into place to define how the network should delegate the tasks; a basic implementation can have each node run one test and return the given result. This way all the tests can be run in parallel and the workload is distributed.


7. **Distributed containers.** Another specific implementation of idea #5. Here an interconnected swarm of nodes distributes tasks to the individual nodes; and the nodes execute the tasks they're given. These tasks have the individual nodes execute containers and run apps inside those containers. A high number of nodes in the network can mean any container/app combination can be run at any given moment. Imagine using this type of network to offer cloud services: picture a decentralised EC2.


8. **Distributed video analysis for augmented reality.** One final implementation of idea #5. One type of augmented reality application involves reading from a video input source and analyzing the data for a match given a query – most of the time this can be seen as looking for an object or groups of objects in the video and relating them to some metadata. When a match is found, a request for metadata is executed and the response can be embedded on top of the video source. Imagine an application that can take any movie as input and can recognize actors' faces, fetch metadata from IMDB and display the given data near the actor's face. Now imagine the same application looking for any other matches (cars, animals, books, etc). This type of application can delegate the tasks of finding the different matches to different nodes in the swarm, effectively distributing the workload while having the network benefit from the independent efforts of each node. Whenever a node finds a match the information is distributed to all the nodes, thus all nodes will receive the metadata for the video source while only having to work on independent, smaller tasks.

   Let's say you're watching a movie, you don't remember the name for it nor the main character's name. You raise your mobile phone and run our Face Recognition decentralised AR app. The app reads from the camera and starts streaming the video to the peer to peer network (if P2P streaming has matured enough maybe every node helps distribute the video too). Another node in the network starts analyzing the feed, it finds faces using face recognition algorithms and finds a hit to a known face. The node then fetches metadata for the actor that was matched and publishes a hit back to the network.
Your smartphone receives the event with the computed data that includes the actor's information and it displays an overlay near the person's face in order to render the information–it can even provide a list of movies the actor appears in, with the one you are watching at the top of the list.


9. **Private networks for massive events.** Connecting to the Internet during massive events in countries like Mexico, Argentina and Spain is an impossible task. By introducing a custom network, companies can provide their users with the full capabilities of real internet applications. The network can deliver those applications, users can execute them directly in their devices (similar to offline mode) and take further actions once the users can get back online. Furthermore, the network can use the replicate & redistribute capabilities of the network to provide real-time events to all the connected users. Such an isolated network can provide software for second screen experiences to everyone attending, thus enhancing the audience's experience. Take note that this would require the venue to provide enough access points for the attendees.


10. **Private networks events with low or no connectivity.** As a specific branch of #9 this can solve a similar issue for events in places with bad connectivity or none at all: imagine airplane or bus trips, cruise ships, ski resorts and/or private corporate events. By joining the network any node can help the swarm redistribute any software in order to take part on activities designed for the event. This could provide the software distribution layer as well as the business logic for the event. There wouldn't be any need to connect to the outside world since the network would be able to deliver all the applications needed to interact as well as all the management tools.


11. **Global ranking system.** It is possible to offer a decentralised ranking service using the IPFS network. This would solve the problem of having one central authority responsible for the leaderboard. Any person could take part in events/dynamics with a gaming layer that involve a ranking/hierarchical list of their users. The idea is to leverage append only logs where users are given a rank level in the network.
Rather than receiving points and having to compute the new state of the leaderboard every time an event takes place, users can trade ranking spots (similar to trading cryptocurrencies). Imagine this ranking structure in a way that a user “owns” the Nth ranking spot and whenever an event occurs the spot is exchanged. A gaming layer could be implemented easily without having to implement software to maintain the data.
There is one piece of the puzzle that hasn't been solved before this type of Dapp can surface: a sustainable and efficient distributed consensus process. Without that, it is not possible to differentiate valid transactions for events from ill-intenioned ones.

    With this any developer can implement a decentralised leaderboard layer into their software and their users would be the ones holding the data. There would be no need for backend software. Every node connected to the network could fetch the leaderboard and see the user rankings.
By defining events the users will trade spots. E.g. _a race around the world_. The player that wins gets the top most rank out of both players, the other gets the lowermost rank. Every user can access the leaderboard and see the person ranking in the first spot, if they want to become the leader, they'll have to challenge the current user (using the Dapps specific events).


12. **Decentralised video sharing app.** A distributed swarm of computers can excel at distributing large files: You've downloaded a video from the Internet and the person in the room next to you also wants to watch that same video. Isn't it silly that they have to re-download the video across the backbone of the Internet, from the same cloud server that you just downloaded it from? Why can't they get it directly from you, sitting right in the next room to them? Wouldn't that be so much faster? Distributed technologies can make this happen.
If paired with IPFS's optimized content distribution strategy (IPFS's strategy helps deliver rare pieces of content over more common ones) it would make it easier to seed incomplete files – no need to get the full file to start sharing the piece that's already been downloaded, especially if your node is the only one holding that piece.

    There are a couple of Dapps already working on this functionality:
    - https://d.tube/
    - http://paratii.video/


13. **Decentralised maps/cartography app.** Decentralised maps with real time updates from nodes. Imagine receiving the traffic updates directly from nodes and having the network distribute all this data. No central point of failure and less chance of [getting directions into wild fires](https://www.usatoday.com/story/tech/news/2017/12/07/california-fires-navigation-apps-like-waze-sent-commuters-into-flames-drivers/930904001/). We found this experimental software to distribute map data over a peer to peer network: [peermap](https://git-ssb.celehner.com/%25SEumoOl%2BJ5u%2B1E3PWLYtyWNsZl8IhL2mEtlylBXsuU8%3D.sha256). An added layer of disk space usage management would be needed so that the nodes do not need to download all the data but only the specific pieces that are required.
Still, maybe smartphones aren't best suited to form mesh networks and share lots of data. This Dapp might need some extra help from long lived nodes that can contribute to the network, so that on-demand usage can still work.

    Rather than other passengers on the road reporting traffic incidents to a central server like Waze, passengers in cars can communicate directly with one another. When paired with third party antena systems (or having such mesh network capabilities built directly into future cars and phones), this allows creating a system like Waze that works even in remote locations with bad connectivity. Additionally, as automated cars become more and more common, the ability for them to communicate quickly, directly car-to-car, becomes even more paramount. The development of a robust decentralized transport-communication network can also prevent one particular entity from becoming the arbiter of road safety.


14. **Distributed software distribution.** Decentralised software distribution. Need an app? Get it from the closest node to you. Upload your changes and let the network broadcast the changes and the nodes that are interested can download them accordingly. This is the decentralised app store. All nodes joining the network share a normalized app listing/directory—when the directory grows too much in size it can be split into smaller listings. Any node can upload new software to the directory and fetch software from it.
Developers can definitely benefit from an app store that does not charge a big commission out of their sales, but this Dapp would only help deliver the software, another Dapp or layer would be needed to start accepting payment for the downloads.


15. **Decentralise state store for Dapps.** Any type of frontend app that uses a store container similar to React's redux or Vue's vuex can implement their store using decentralised tools and have a swarm of interconnected webapps share the same state. Updates will be broadcasted in a real-time fashion and users with low connectiviy can benefit from offline behaviour. There is no need for a server to hold the source of truth and the last word on the data. With the decentralised state store, apps will share data updates, generate new data, remove data and work in collaboration (as in some of the other ideas we've described above). This Dapp will work as an implementation layer for developers.


16. **Enterprise for any of the above.** With private swarms a controlled network can include any option from above (and maybe mix them up), put that in a box and ship it out. Any company can use their existing infrastructure to integrate any and all of the distributed/decentralised ideas from the list.


## Next steps

There is a big trend going on of [_X but with Blockchain_](https://angel.co/blockchains) and [_simply add Bitcoin to your business name_](https://www.nytimes.com/2017/12/21/technology/bitcoin-blockchain-stock-market.html) type of ideas. Does this mean the world is ready for a decentralised Internet? I don't think so. The hype might mean people are looking and working in the right direction, still I invite you all to dive into the [IPFS paper](https://ipfs.io/ipfs/QmR7GSQM93Cx5eAg6a6yRzNde1FQv7uL6X1o4k7zrJa3LX/ipfs.draft3.pdf) to fully understand all the concepts behind such tools and protocols–we really enjoyed working out the details and grasping the required concepts to make our Dapp work. I am certain as more people read the document and get their hands dirty working with these technologies, the tipping point will be reached and Dapps will go mainstream.


### Gaps in the current Dapp stack

We identified some problems that need to be solved before full delivery of the Dapps in the list can be achieved. These problems include:

- **Authentication & Identity.**
Many of the Dapps in our list require encrypted data and access control. They require giving _certain people_—and no one else—the ability to view/collaborate on data. Distributed identity [is a hard problem to solve](https://youtu.be/PjE1O8K-h0I), and we're keeping an eye on developments in this space. Some emerging tools/solutions that have caught our eye are [Metamask](https://metamask.io/) and [Blockstack](https://blockstack.org/posts/blockchain-identity).
- **Disk space optimization.**
For the app we made, all nodes in a Community download and distribute all the data in that community. This strategy obviously falls apart for apps with larger datasets. Can we come up with a strategy where nodes hold more data only if they will be connected for a longer time? How will this affect data availability? What pieces should short-lived nodes back up?
- **Distributed consensus.**
Proof of Work is far from the final solution for distributed consensus. Bitcoin hasn't quite reached mainstream and it already has [more than 200k pending transactions](https://news.ycombinator.com/item?id=15964812). [Part of the scaling problem is directly attributable to its use of proof of work](https://pfrazee.github.io/blog/secure-ledgers-dont-require-proof-of-work). Other strategies have come up like [proof of stake](https://en.wikipedia.org/wiki/Proof-of-stake), but there isn't a clear winner yet.
Can we come up with a way to establish trust in a decentralised system that scales globally? Something out of the box that simply works for all (for simple use cases with less than one thousand users and for others with millions)?
The _Global Leaderboard_ idea from above needs this if it'll ever work: how can anyone trust the ranking system? Is it _true_ that some user ranks in the Nth spot? The Dapp describes _events_ that take place and users swap rank spots, yet how can we be sure user A really beat user B in an event?
- **P2P live video streaming.**
There are experiments out there to find a solution to this problem ([resort](https://github.com/victorbjelkholm/resort)) and some notes on this date back to 2012 on [TechCrunch](https://techcrunch.com/2012/02/13/bittorrent-live/). IPFS can even be used to [stream video files](https://github.com/ipfs/js-ipfs/tree/master/examples/browser-video-streaming). This technology could open live streaming to publishers of any scale and incorporate directly into decentralised networks.
The _distributed video analysis_ app from above needs live peer to peer video in order to work, in order to feed all the connected nodes the input source to analyze.


### Where do we _fork_ from here?

![Fork](http://forked.yannick.io/images/logo.png)

We also identified categories of Dapps that can be worked upon and that could start out from a fork of the work we did. These categories include:.

- Apps that use collaborative editing on shared data/documents.
- Apps that create & post or find & share content with other users.
- Apps that share disk space usage and that can benefit from P2P redistribution of content.

Let us know what other distributed Dapp ideas come to mind. We came up with this list after working with the technology and after we understood its inner ticks. We know these protocols & tools will help with problems that haven't yet been discovered.
