import React from 'react'

import Section from '../Section'

import link from './link.svg'
import facebook from './facebook.svg'
import twitter from './twitter.svg'
import './Share.css'

export default () => (
  <Section
    style={{
      backgroundColor: '#AC3434',
      paddingBottom: '1em',
    }}
  >
    <p>
      Share this page with others:
    </p>
    <div className="Share-buttons">
      <button onClick={() => alert('todo')}>
        <img alt="copy link" src={link} />
      </button>
      <button onClick={() => alert('todo')}>
        <img alt="share on facebook" src={facebook} />
      </button>
      <button onClick={() => alert('todo')}>
        <img alt="tweet" src={twitter} />
      </button>
    </div>
  </Section>
)
