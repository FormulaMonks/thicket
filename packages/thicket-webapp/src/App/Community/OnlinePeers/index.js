import React, { Component } from 'react'
import UserName from '../../../components/UserName'
import usersSvg from './users.svg'
import backSvg from './back.svg'
import randomColor from 'randomcolor'
import { isMobile } from '../../../utils/constants'
import './OnlinePeers.css'

const LIST = 'show online peers list'
const INFO = 'show description for list'

const UsersImg = ({ className }) =>
  <img
    src={usersSvg}
    alt="Online Peers"
    className={`onlinePeers-svg${className ? ` ${className}` : ''}`}
  />

const Info = ({
  className='',
  onClick=()=>{},
  onOver=()=>{},
  onOut=()=>{}
}) => <button
    className={`onlinePeers-infoBtn${className ? ` ${className}` : ''}`}
    onClick={onClick}
    onMouseOver={onOver}
    onMouseOut={onOut}
  >
  ?
</button>

class OnlinePeers extends Component {

  state = { mode: null }

  render() {
    const { mode } = this.state
    const { onlinePeers, colors, className } = this.props
    const innerCount = new Map()
    const onlinePeersNicknameCount = onlinePeers.reduce((p, c) => {
      if (!p.has(c)) {
        p.set(c, 0)
        innerCount.set(c, 0)
      }
      p.set(c, p.get(c) + 1)
      return p
    }, new Map())
    // (you) color same as header
    colors[0] = randomColor({ luminosity: 'dark', seed: onlinePeers[0] })

    return <div
      ref={n => this.node = n}
      className={`${className} onlinePeers onlinePeers--aligned-left`}
      onBlur={this.maybeBlur}
    >
      <div className="onlinePeers-count">
        <button className="onlinePeers-btn" onClick={() => this.setState({ mode: mode === LIST ? null : LIST })}>
          {onlinePeers.length}
          <UsersImg />
        </button>
      </div>
      <div className={`onlinePeers-wrapList onlinePeers-wrap${mode === LIST ? ' onlinePeers-wrap--active' : ''}`}>
        <div className="onlinePeers-title">
          <div className="onlinePeers-title-inner">
            <UsersImg className="onlinePeers-svg-inner" />
            <h4>Devices Online</h4>
          </div>
          <Info
            className="onlinePeers-infoBtnInner"
            onClick={e => isMobile && this.setState({ mode: this.state.mode === INFO ? null : INFO })}
            onOver={() => !isMobile && this.setState({ mode: INFO })}
            onOut={() => !isMobile && this.setState({ mode: null })}
          />
        </div>
        <ul
          data-test="online-peers-list"
          className="onlinePeers-list"
        >
          {onlinePeers.map((peer, index) => {
            const count = onlinePeersNicknameCount.get(peer)
            innerCount.set(peer, innerCount.get(peer) + 1)
            return <li
                key={`online-peer-${peer}-${index}`}
                data-test="online-peers-item"
                className="onlinePeers-item"
              >
                <UserName str={peer} bgColor={colors[index]} />
                {index === 0
                  ? <span
                      data-test="online-peers-you"
                      className="onlinePeers-you"
                    >
                      (you)
                    </span>
                  : count > 1 ? `(${innerCount.get(peer)})` : ''
                }
            </li>
          })}
          </ul>
      </div>
      <div className={`onlinePeers-wrapInfo onlinePeers-wrap${mode === INFO ? ` onlinePeers-wrap--active` : ''}`}>
        <button
          className="onlinePeers-infoBtnBack"
          onClick={() => this.setState({ mode: LIST })}
        >
          <img src={backSvg} alt="Back to list" />Back
        </button>
        <div className="onlinePeers-infoText">
          Every web browser that has this Community opened is helping duplicate and secure its GIFs. Since Thicket has no central servers, other people need to be connected at the same time as you for them to see your GIFs.
        </div>
      </div>
    </div>
  }

  maybeBlur = () => {
    if (document.documentElement.clientWidth > 600){
      this.setState({ mode: null })
    }
  }
}

export default OnlinePeers
