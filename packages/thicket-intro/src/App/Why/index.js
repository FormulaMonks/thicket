import React from 'react'
import Square from '../Square'
import Columns from '../Columns'
import centralized from './centralized.svg'
import decentralized from './decentralized.svg'
import x from './x.svg'
import check from './check.svg'

import './Why.css'

export default ({ id }) => (
  <div className="Why" id={id}>
    <div className="inner">
      <h2>Motivation &amp; Why We Built It</h2>
      <p>
        From making the web
        {' '}<a href="https://medium.com/ibm-watson-data-lab/offline-first-whats-in-a-name-89c410910694">faster</a>{' '}
        for its current citizens as well as its
        {' '}<a href="https://www.youtube.com/watch?v=eHIfPLt-Ckc">next billion</a>,{' '}
        to
        {' '}<a href="https://flyingzumwalt.com/2016/04/12/the-internet-has-been-stolen-from-you-take-it-back-nonviolently/">data liberation</a>,{' '}
        to creating whole
        {' '}<a href="http://www.usv.com/blog/fat-protocols">new business models</a>,{' '}
        we’re excited about the potential of the offline-first, decentralized web.
      </p>
      <Columns>
        <div>
          <Square background={centralized} />
          <img src={x} alt="" />
          <div>Centralized Web limits opportunity</div>
        </div>
        <div>
          <Square background={decentralized} />
          <img src={check} alt="" />
          <div>Decentralized Web offers persistent availability without a backbone</div>
        </div>
      </Columns>
    </div>
  </div>
)
