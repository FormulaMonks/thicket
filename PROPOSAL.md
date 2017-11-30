Thicket: How we'll build a Vine clone without using a single server
===================================================================

_Internal Citrusbyte Proposal, 2017-09-25_

Vine was a short-form video hosting service where users could share
six-second-long looping video clips. You can think of it as the "Instagram for
GIFs."

We plan to build a clone of this service that utilizes **Offline First** and
**Distributed Web** technologies. If the necessary networks and protocols are
mature enough, we will be able to build an entire proof-of-concept social
network that stores all of its data within its users' devices, requiring no
centralized servers for data storage.

Content created in the app will be shareable to the traditional web.


Ideal App
---------

If we built the app to "completion" (insofar as any app is ever complete), it
would have the following:

1. Progressive Web App, usable from desktop or mobile browsers, savable to device home screen
2. Creation of GIFs using device camera and JavaScript
3. Creation of personal feed of own created content
4. Serving content: replicating content across devices without central servers
5. Sharing content to traditional web
6. User authentication
7. Social interaction: users following other users

In addition to the app, we also plan to document our whole process and our
findings along the way.


Why should Citrusbyte spend resources on this?
----------------------------------------------

The app as envisioned builds up our expertise in three areas. All are
potentially lucrative:

* **Offline/Performance First**: Two of our engineers have already [written
  about][denis] or [given talks][chad] on this subject, which indicates that
  working with this tech would give the team a morale boost. Offline First is a
  growing trend with [a championing organization][offlinefirst] and especially
  big implications for emerging world markets.
* **Decentralized Web**: Two of our engineers have already [given talks][chad]
  and [build projects][gorka] with this tech, which indicates working with this
  tech would give the team a morale boost. Decentralized web tech is still
  emerging, and Citrusbyte can get in ahead of the curve and position ourselves
  as a leader in what many are calling "[Web 3.0](https://en.wikipedia.org/wiki/Semantic_Web#Web_3.0)"

  [denis]: https://medium.com/@denis.sokolov_53985/state-on-the-front-end-5b80c0045f07
  [chad]: https://www.youtube.com/watch?v=wxDn1XMVwNE
  [offlinefirst]: http://offlinefirst.org/
  [gorka]: https://github.com/AquiGorka/socnet


The Roadmap
-----------

Even if we don't "complete" the app, we have a plan that will ensure that we will learn (& teach others) useful information, build something beautiful, and establish (& show off) in-house expertise.

### Step 1: Create GIFs from device's camera _[1 week]_

We will create a web-based React app that runs entirely client-side. It will use the device's camera to record video and convert them to GIFs. These GIFs will be stored locally with [Service Workers][serviceworkers] and the list of GIFs will be stored with [Local Storage][localstorage], so that all created GIFs will still be present when the app is closed and reopened later.

**Deliverables**

* Responsive web app which uses device APIs to capture video input and create a gif, and then uses Offline First tech to store that GIF _[2 days]_
* Announce our efforts in discuss.ipfs.io, offlinefirst.slack.com, and other relevant forums _[1 day]_

**A note on time estimates**

The total time for this step is listed as one full week to build in time for the administrivia that accompanies the beginning of projects.

  [serviceworkers]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
  [localstorage]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
  [expo]: https://expo.io/


### Step 2: The Hive Mind's GIF Stream _[1 week]_

At this step, we will start adding no-server data sharing between all devices currently using the app, but we will not yet have user authentication. You could imagine this being similar to all users being automatically logged into the same account.

This will obviously run into problems very quickly if many users swarm the app at the same time. We don't anticipate enough notability at this stage for this to be an issue. If it does cause problems, we can introduce simple functionality to counteract these effects (perhaps a button to quickly delete all content).

**Deliverables**

* Establish local IPFS node using [ipfs.js] _[1 day]_
* Add GIFs to IPFS, which gives them permanent links usable from traditional web _[1 day]_
* Use [IPFS PubSub with CRDTs][crdts] to sync GIF stream between all connected devices _[1 day]_
* A share button to post content to Twitter and other social networks _[1 day]_
* Blog post to explain what we did and how it works _[1 day]_

**A note on the time estimates**

[IPFS PubSub with CRDTs][crdts] is already well-defined, and we expect to be able to add this into our app fairly quickly. See Step 4 for our plans to explore other decentralized data solutions.

  [ipfs.js]: https://github.com/ipfs/js-ipfs
  [crdts]: https://ipfs.io/blog/30-js-ipfs-crdts.md


### Step 3: user sign-in; a real social network _[3 weeks]_

Signing into a decentralized network is fundamentally different from signing into a centralized one. Every centralized app you use requires you to have a distinct login with that app. This would be like every store you visit requiring you to have a distinct ID card issued by the store.

By contrast, when you use a decentralized app, you bring your identity with you. You create your own identification card, essentially, and then carry it all around with you. It can have reputation—such as that established in apps like Airbnb, Uber, and StackOverflow—associated with it, and this reputation comes with you to new apps that you use.

There are several different decentralized identity projects we can explore.

* [Blockstack]
* [Scuttlebutt]
* [Keybase]
* [MetaMask]
* Others discussed in [Blockstack Summit's Identity Panel][identity]

  [Blockstack]: https://blockstack.org/
  [Scuttlebutt]: https://github.com/dominictarr/scuttlebutt
  [Keybase]: https://keybase.io/
  [MetaMask]: https://metamask.io/
  [identity]: https://youtu.be/PjE1O8K-h0I

Once users are authenticated and meaningfully distinct, we need to create profile pages for each user, which will become part of the data structure that is replicated between peers with the IPFS PubSub approach established in Step 2. Each user data structure must also point to all other users that this user follows.

This approach has obvious huge security flaws, but as a proof-of-concept, we accept those risks at this step. Ideally, information specific to a user, such as who they follow, would be stored in a way that cannot be modified by anyone but themselves. Perhaps it could be stored as part of their identity object, as social graph information helps uniquely identify us in real life. Or perhaps such information could be stored in the Bitcoin blockchain, or in an Ethereum Smart Contract. Regardless, this proof-of-concept will not address this issue for now.

**Deliverables**

* Explore at least two different decentralized identity systems _[2 weeks]_
* Implement user-following & social network features _[2 days]_
* Write blog post(s) comparing various decentralized identity systems _[1 day]_


Step 4: Exploring Other Data Replication Strategies _[2 weeks]_
---------------------------------------------------------------

In Step 2, we added data replication using IPFS PubSub. We used this to start off because we already had a sense of how to use it, and wanted to get past that step quickly so that we could converge on a somewhat-usable app by the end of the 6-8 week experiment. Now that user authentication has been added, we would like to circle back and explore other decentralized technologies. We can then compare & contrast these with the IPFS approach.

* [hyperlog]
* [Scuttlebutt]
* [DAT]
* [Storj]
* [BigchainDB]
* Others listed in [this blog post](http://decentralized.blog/picking-a-decentralized-storage-system.html)

  [hyperlog]: https://github.com/mafintosh/hyperlog
  [DAT]: https://www.datprotocol.com/
  [Storj]: https://storj.io/
  [BigchainDB]: https://www.bigchaindb.com/

**Deliverables**

* Explore at least two alterative technologies for sharing data between devices _[1 week]_
* Write blog posts comparing these alternate approaches to the IPFS PubSub approach _[1 day]_
* Publish all of our research and findings about the experiment as a whole. This can be compiled into a PDF, as a pseudo white paper, or any format that we deem appropriate. Also publish our conclusions, comparing the technologies and approaches we used, analyzing their performance, how much we liked them, how easy it was to implement things with them, the resulting code maintainability / scalability, their maturity and adoption, etc. _[2 days]_
* Prepare an internal presentation of the experiment for the entire Citrusbyte engineering team, to be scheduled 1 week after the experiment ends. _[1 day]_
* Create Citrusbyte Lab Experiment page, showing off the app & linking to all published content. _[2 days]_


Step 5: Sharing Our Work _[ongoing]_
------------------------------------

Finally, we'll share our findings within Citrusbyte and with the rest of the world. This will be a long-term stage that will evolve over time as we participate in conferences, write blog posts, contribute to open source tools, etc. But we'll focus on having a strong starting point right after the completion of our experiment, consisting of the following items:

**Deliverables**

* Host internal presentation for Citrusbyte engineering team
* Host (and record) a meetup or study group in Lancaster and/or Philadelphia to share our experiment with others and invite others to speak on the topics we touched.
* Host another meetup or study group in Barcelona, Spain.
* Create conference talks from the researched material, and apply to speak at conferences.
* A rough plan/commitment for ongoing research and experimentation in our free time, as desired
* Link to all such ongoing material on the experiment page.


The Research
------------
[Offline First & Distributed Web Tech](https://docs.google.com/document/d/1XLZCyA3T_gaIAtTm7mr0xG2TBqbEpcKyNOKFyXALVsE/edit?ts=59c95cee#)
