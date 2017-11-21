import React from 'react'
import Columns from '../Columns'
import Section from '../Section'
import onlineOfflineEquivalence from './onlineOfflineEquivalence.jpg'
import stateOnFrontend from './stateOnFrontend.png'
import thicket from './thicket.png'

export default () => (
  <Section style={{paddingBottom: '9em'}}>
    <h2>Open Source &amp; More Info</h2>
    <p>
      Thicket is one project we built to dive deeper with technologies we
      were already exploring. Check out our code, our conference talks, and
      our blog posts.
    </p>
    <Columns style={{textAlign: 'left'}}>
      <a className="muted" href="https://www.youtube.com/watch?v=FXhPBiv4Roo">
        <img alt="" src={onlineOfflineEquivalence} />
        <div><div className="highlight" style={{marginTop: '0.7em'}}>Watch:</div> What Our Interplanetary Tomorrow Can Teach Us About Building Apps Today</div>
      </a>
      <a className="muted" href="https://medium.com/@denis.sokolov_53985/state-on-the-front-end-5b80c0045f07">
        <img alt="" src={stateOnFrontend} />
        <div><div className="highlight" style={{marginTop: '0.7em'}}>Read:</div> State on the front-end</div>
      </a>
      <a className="muted" href="https://github.com/citrusbyte/thicket">
        <img alt="" src={thicket} />
        <div><div className="highlight" style={{marginTop: '0.7em'}}>Code:</div> Thicket source code</div>
      </a>
    </Columns>
  </Section>
)
