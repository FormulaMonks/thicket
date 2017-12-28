import React from 'react'
import { Button } from 'thicket-elements'
import store from '../../database/store'

import heart from './heart.svg'
import singleNode from './singleNode.svg'
import twoNodes from './twoNodes.svg'
import threeNodes from './threeNodes.svg'
import manyNodes from './manyNodes.svg'
import Carousel from './Carousel'
import classes from './Welcome.scss'

export const COMPLETED = 'COMPLETED'
const { user } = store

export default class Welcome extends React.Component {
  async componentDidMount() {
    const onboarding = await user.get('onboarding')
    if (onboarding === COMPLETED) {
      this.props.history.replace('/communities')
    }
  }

  render() {
    return (
      <main>
        <div className={classes.top}>
          <h1 className={classes.lead}>
            Create and share GIFs with your friends in a peer to peer, private
            network
          </h1>
          <Button>Start a New Community</Button>
          <div className={classes.bigDeal}>
            <h2>What's the big deal?</h2>
            <ol className={classes.keyPoints}>
              <li className={classes.decentralized}>
                <p><strong>Decentralized</strong></p>
                <p>
                  Thicket uses IPFS to transfer data directly between you and
                  your peers. Haven’t heard of IPFS? Don’t worry. Just know
                  that no company sits between you and your friends.
                </p>
              </li>
              <li className={classes.communityHosted}>
                <p><strong>Community-hosted</strong></p>
                <p>
                  All the GIFs you create are stored right on your device and
                  the devices of your friends. When you are part of a Thicket
                  Community, you are helping back up and preserve that
                  Community's GIFs. You always own your own data; it's never
                  stored on any centralized server.
                </p>
              </li>
              <li className={classes.noAds}>
                <p><strong>You are not the product</strong></p>
                <p>
                  No ads or tracking, ever. You don’t even have to trust us on
                  it—since this is open source and peer to peer, there isn’t
                  someone who can add this stuff in later.
                </p>
              </li>
            </ol>
          </div>
        </div>
        <div className={classes.whyGifs}>
          <div className={classes.heartGif}>
            <img alt="" src={heart} />
          </div>
          <h2>Why GIFs? Because they're fun.</h2>
          <p>
            Could this be implemented for any other type of media? Absolutely.
            We chose GIFs because they’re fun. But think of any other type of
            content, and we could build the same sort of app for that, too.
          </p>
        </div>
        <div className={classes.howItWorks}>
          <h2>How it works</h2>
          <Carousel>
            <div>
              <p>
                When you start your community and createa a GIF, it is only
                stored on your device.
              </p>
              <img alt="" src={singleNode} />
            </div>
            <div>
              <p>
                When you invite a peer to a Community, your machine talks
                directly to theirs. All GIFs are then stored on each of your
                devices. Thicket must be open to sync devices.
              </p>
              <img alt="" src={twoNodes} />
            </div>
            <div>
              <p>
                When a third peer is invited, they will pull data directly from
                you and/or peer #2. If you or peer #2 is offline, peer #3 will
                get the data from the other.
              </p>
              <img alt="" src={threeNodes} />
            </div>
            <div>
              <p>
                The more people in a Community, the more secure the data, and
                the easier it becomes for new peers to get all of it.
              </p>
              <img alt="" src={manyNodes} />
            </div>
          </Carousel>
        </div>
        <div className={classes.bottom}>
          <h2>Start creating and sharing now</h2>
          <Button>Start a New Community</Button>
        </div>
      </main>
    )
  }
}
