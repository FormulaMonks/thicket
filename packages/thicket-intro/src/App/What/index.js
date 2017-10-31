import React from 'react'
import Columns from '../Columns'
import Square from '../Square'
import onlineOfflineEquivalence from './onlineOfflineEquivalence.jpg'
import stateOnFrontend from './stateOnFrontend.png'
import thicket from './thicket.png'

import './What.css'

export default () => (
  <div className="What wrap">
    <div className="What inner">
      <h2>Open Source &amp; More Info</h2>
      <p>
        Thicket is one project we built to dive deeper with technologies we
        were already exploring. Check out our code, our conference talks, and
        our blog posts.
      </p>
      <Columns>
        <a className="muted" href="https://www.youtube.com/watch?v=FXhPBiv4Roo">
          <Square background={onlineOfflineEquivalence} />
          <div><span className="highlight">Watch:</span> What Our Interplanetary Tomorrow Can Teach Us About Building Apps Today</div>
        </a>
        <a className="muted" href="https://medium.com/@denis.sokolov_53985/state-on-the-front-end-5b80c0045f07">
          <Square background={stateOnFrontend} />
          <div><span className="highlight">Read:</span> State on the front-end</div>
        </a>
        <a className="muted" href="https://github.com/citrusbyte/thicket">
          <Square background={thicket} />
          <div><span className="highlight">Code:</span> Thicket source code</div>
        </a>
      </Columns>
    </div>
  </div>
)
