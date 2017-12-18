# 16 apps you might find in a Decentralised app store node by mid 2018

For some of us, trying to picture the future is a daily activity; some days lead into ideas that should not be pursued and other days help guide the present into expressions of what the world can be. Citrusbyte is a thought-leader in both software engineering and design, and as part of our work we commit ourselves to research experiments with cutting edge technologies.


## Building the future

> Computer science is all about creating good abstractions. Good abstractions are all about presenting a view of the world that can be used.

This past September, my team at Citrusbyte embarked on a research project into decentralised applications. We set our goal to build a decentralised clone of Vine - the GIF sharing app. We started out from scratch, coding small, step-by-step sized features one at a time. We refactored once the new concepts where settling in our minds and came up with new concepts of our own.

You can read more on our mission to evaluate the maturity of IPFS’s network, to weigh strategies for building decentralised apps and the problems we ran into here: [The state of frontend development with IPFS in 2017](http://bits.citrusbyte.com/the-state-of-frontend-development-with-IPFS-in-2017/).

The following concepts give context and scope to the apps in the list:

### Private IPFS swarms

IPFS works in a p2p fashion. When an IPFS node is executed it reaches out to several `signaling servers`. These servers help the node to find & connect to other IPFS nodes. By removing the IPFS default `signaling servers` configuration from the node it will not be able connect to any other node. Then, by configuring the node to reach out to a custom `signaling server` we can control to which nodes it connects to. This way we can achieve a private swarm of IPFS nodes. This swarm will include all the IPFS protocols & tools. Any type of authentication layer can be integrated into the signaling server (SSH keys, JWT tokens, HTTP credentials) to control which nodes can find each other. This layer does not provide a decentralised identity layer but can work out of the box for SSO (Single Sign-On) services.


### Shared Resources

While we were working on our decentralised app, we came up with the concept of Community. A Community is a group of nodes connected to each other where each node shares their independent resources to the Community. Nodes in our app where sharing disk space and bandwidth with their Communities. In our app users create and share GIFs with their Communities, each node in the Community would replicate the GIFs and help redistribute the data with each other - in a similar fashion as to how torrent works.

By leveraging the swarm of connected computers we can distribute tasks amongst them, meaning the computational power of the network can be used for tasks that require some extra power (imagine the network as a botnet that responds to commands).


### CRDT ([`Conflict-free Replicated Data Type`](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type))

To maintain data consistency between the connected nodes we used [`YJS`](https://github.com/y-js/yjs). It gave us the freedom to collaborate on shared data structures without having to normalize them every time a node dispatched an action that triggered and update to the network. No need to figure out who did what and in what order. It also gave us the ability to work offline and to merge updates into the shared data once the node reconnected to the network.


## The Dapps

1. Decentralised file collaboration and file sharing app with offline functionality
2. Distributed password manager
3. Distributed file system
4. Distributed Wikipedia
5. Distributed package management
6. Distributed botnet + command center
7. Distributed continuous integration
8. Distributed video analysis for augmented reality
9. Private networks for massive events
10. Private networks events with low or no connectivity
11. Global ranking system
12. Peer to peer content sharing network
13. Decentralised video sharing app
14. Decentralised maps/cartography app
15. Distributed software distribution
16. Enterprise for any of the above

## Where do we _fork_ from here?

There is a big trend going on of "X company with Blockchain" type of ideas but there are a lot of concepts that need to be grasped before the tipping point is reached and Daaps go mainstream. We identified some problems that need to be solved before we reach full delivery of the apps on the list. These problems include:

- Authentication
- Disk space optimization
- Distributed consensus
- P2P video streaming

We also identified categories of Dapps that can be worked upon and that could start out from a fork of our development. These categories include:.

- Apps that use collaborative editing on data/documents
- Apps that post & share content with users
- Apps that share disk space usage and that use p2p redistribution for content

Let us know what other distributed ideas come to mind. We came up with this list after working with the technology and understanding its inner ticking and we know this type of tools will help with problems that haven't yet being discovered.
