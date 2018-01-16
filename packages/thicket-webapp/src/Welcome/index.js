import React from 'react'
import { Button } from 'thicket-elements'

import Logo from '../components/Logo'
import heart from './heart.svg'
import singleNode from './singleNode.svg'
import twoNodes from './twoNodes.svg'
import threeNodes from './threeNodes.svg'
import manyNodes from './manyNodes.svg'
import Carousel from './Carousel'
import harper from './harper.gif'
import anne from './anne.gif'
import './Welcome.css'
import localForage from 'localforage'

export const COMPLETED = 'COMPLETED'

export default class Welcome extends React.Component {
  async componentDidMount() {
    const onboarding = await localForage.getItem('onboarding')
    if (onboarding === COMPLETED) {
      this.props.history.replace('/communities')
    }
  }

  render() {
    return (
      <main className="Welcome">
        <div className="Welcome-top">
          <div className="Welcome-bgGifs">
            <div><img alt="" src={harper} /></div>
            <div><img alt="" src={anne} /></div>
          </div>
          <header className="Welcome-header"><Logo /></header>
          <div className="Welcome-container">
            <div className="Welcome-lead">
              <h1>
                Create and share GIFs with your friends in a peer to peer, private
                network.
              </h1>
              <Button style={{padding: '1em 1.5em'}}>Start a New Community</Button>
            </div>
            <div className="Welcome-bigDeal">
              <h2>What's the big deal?</h2>
              <ol className="Welcome-keyPoints">
                <li className="Welcome-decentralized">
                  <strong>Decentralized</strong>
                  <p>
                    Thicket uses IPFS to transfer data directly between you and
                    your peers. Haven’t heard of IPFS? Don’t worry. Just know
                    that no company sits between you and your friends.
                  </p>
                </li>
                <li className="Welcome-communityHosted">
                  <strong>Community-hosted</strong>
                  <p>
                    All the GIFs you create are stored right on your device and
                    the devices of your friends. When you are part of a Thicket
                    Community, you are helping back up and preserve that
                    Community's GIFs. You always own your own data; it's never
                    stored on any centralized server.
                  </p>
                </li>
                <li className="Welcome-noAds">
                  <strong>You are not the product</strong>
                  <p>
                    No ads or tracking, ever. You don’t even have to trust us on
                    it—since this is open source and peer to peer, there isn’t
                    someone who can add this stuff in later.
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div className="Welcome-whyGifs">
          <div className="Welcome-container">
            <div className="Welcome-heartGif">
              <img alt="" src={heart} />
            </div>
            <div className="Welcome-whyGifsText">
              <h2>Why GIFs? Because they're fun.</h2>
              <p>
                Could this be implemented for any other type of media? Absolutely.
                We chose GIFs because they’re fun. But think of any other type of
                content, and we could build the same sort of app for that, too.
              </p>
            </div>
          </div>
        </div>
        <div className="Welcome-howItWorks">
          <h2>How it works</h2>
          <Carousel>
            <div className="Welcome-slide">
              <p>
                When you start your community and create a GIF, it is only
                stored on your device.
              </p>
              <img
                alt=""
                src={singleNode}
                style={{objectFit: 'scale-down'}}
              />
            </div>
            <div className="Welcome-slide">
              <p>
                When you invite a peer to a Community, your machine talks
                directly to theirs. All GIFs are then stored on each of your
                devices. Thicket must be open to sync devices.
              </p>
              <img
                alt=""
                src={twoNodes}
                style={{padding: '0 1rem', objectFit: 'scale-down'}}
              />
            </div>
            <div className="Welcome-slide">
              <p>
                When a third peer is invited, they will pull data directly from
                you and/or peer #2. If you or peer #2 is offline, peer #3 will
                get the data from the other.
              </p>
              <img
                alt=""
                src={threeNodes}
                style={{padding: '0 1rem'}}
              />
            </div>
            <div className="Welcome-slide">
              <p>
                The more people in a Community, the more secure the data, and
                the easier it becomes for new peers to get all of it.
              </p>
              <img
                alt=""
                src={manyNodes}
                style={{padding: '1.6em 0', objectFit: 'cover'}}
              />
            </div>
          </Carousel>
        </div>
        <div className="Welcome-bottom">
          <h2>Start creating and sharing now.</h2>
          <Button style={{padding: '1em 1.5em'}}>Start a New Community</Button>
        </div>
      </main>
    )
  }
}
