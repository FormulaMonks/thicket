import React from 'react'
import Columns from '../Columns'
import Square from '../Square'
import Section from '../Section'

import offline from './offline.svg'
import p2p from './p2p.svg'
import conflictResolution from './conflict-resolution.svg'

export default () => (
  <Section>
    <h2>How’s Thicket work?</h2>
    <p>
      Thicket is a research project we built to learn more about
      {' '}<a href="http://offlinefirst.org/">Offline First</a>{' '}
      and
      {' '}<a href="http://blog.archive.org/2015/02/11/locking-the-web-open-a-call-for-a-distributed-web/">Distributed Web</a>{' '}
      technologies. It uses new tools like
      {' '}<a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API">Service Workers</a>{' '}
      and
      {' '}<a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage">Local Storage</a>{' '}
      so that your data is still there, even if you lose connection. And it uses emerging tools like
      {' '}<a href="https://ipfs.io/">IPFS</a>{' '}
      and
      {' '}<a href="https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type">CRDTs</a>{' '}
      to avoid centralized servers altogether.
    </p>
    <Columns>
      <div>
        <Square background={offline} />
        <div>Website &amp; Data Available Offline</div>
      </div>
      <div>
        <Square background={p2p} />
        <div>Peer-to-Peer Data Sharing</div>
      </div>
      <div>
        <Square background={conflictResolution} />
        <div>Automatic Conflict Resolution</div>
      </div>
    </Columns>
  </Section>
)
