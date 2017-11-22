import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import Section from '../Section'

import link from './link.svg'
import facebook from './facebook.svg'
import twitter from './twitter.svg'
import './Share.css'

const pageURL = window.encodeURIComponent(window.location.href)

export default class Share extends React.Component {

  state = { linking: false, copied: false }

  maybeHideDropdown = e => {
    if (
      !e.relatedTarget ||
      (this.sharebox && !this.sharebox.contains(e.relatedTarget))
    ) {
      this.setState({ linking: false, copied: false })
    }
  }

  render() {
    const { linking, copied } = this.state

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
          <button
            className={`Share-button${linking ? ' Share-button-link' : ''}`}
            onClick={() => this.setState({ linking: true })}
          >
            <img alt="copy link" src={link} />
          </button>
          <a className="Share-button" target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=${pageURL}`}>
            <img alt="share on facebook" src={facebook} />
          </a>
          <a className="Share-button" target="_blank" href={`https://twitter.com/home?status=Mars.%20GIFs.%20Fun%20times.%20Check%20it%20out%3A%20${pageURL}`}>
            <img alt="tweet" src={twitter} />
          </a>
          {linking &&
              <div className="Share-linkbox">
                <div><strong>Copy Share Link</strong></div>
                <label htmlFor="url">Copy the link and share it with your friends:</label>
                <div className="Share-linkbox-inputWrap">
                  <input
                    className="Share-linkbox-input"
                    readOnly
                    id="url"
                    value={window.location.href}
                    ref={input => { if (input) { input.focus(); input.select(); } } }
                  />
                  <CopyToClipboard
                    text={window.location.href }
                    onCopy={() => this.setState({ copied: true })}
                  >
                    <button className={`Share-linkbox-copybutton${copied ? ' copied' : ''}`}>
                      Copy
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
          }
        </div>
      </Section>
    )
  }
}
