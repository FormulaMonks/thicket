import React from 'react'

import Section from '../Section'

import link from './link.svg'
import facebook from './facebook.svg'
import twitter from './twitter.svg'
import './Share.css'

const pageURL = window.encodeURIComponent(window.location.href)

export default class Share extends React.Component {

  state = { linking: false }

  maybeHideDropdown = e => {
    if (
      !e.relatedTarget ||
      (this.sharebox && !this.sharebox.contains(e.relatedTarget))
    ) {
      this.setState({ linking: false })
    }
  }

  render() {
    return (
      <Section
        style={{
          backgroundColor: '#AC3434',
          paddingBottom: '1em',
        }}
      >
        <p>
          Share this page with others:
        </p>
        <div
          className="Share-buttons"
          tabIndex="0"
          onBlur={this.maybeHideDropdown}
          ref={div => this.sharebox = div}
        >
          <button className="Share-button" onClick={() => this.setState({ linking: true })}>
            <img alt="copy link" src={link} />
          </button>
          <a className="Share-button" target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=${pageURL}`}>
            <img alt="share on facebook" src={facebook} />
          </a>
          <a className="Share-button" target="_blank" href={`https://twitter.com/home?status=Mars.%20GIFs.%20Fun%20times.%20Check%20it%20out%3A%20${pageURL}`}>
            <img alt="tweet" src={twitter} />
          </a>
          {this.state.linking &&
              <div className="Share-link">
                <label>
                  Copy the link and share it with your friends:
                  <input
                    readOnly
                    value={window.location.href}
                    ref={input => { if (input) { input.focus(); input.select(); } } }
                  />
                </label>
              </div>
          }
        </div>
      </Section>
    )
  }
}
