import React, { Component } from 'react'
import UserName from '../../../components/UserName'
import usersSvg from './users.svg'
import randomColor from 'randomcolor'
import './OnlinePeers.css'

const UsersImg = ({ className }) =>
  <img
    src={usersSvg}
    alt="Online Peers"
    className={`onlinePeers-svg${className ? ` ${className}` : ''}`}
  />

class OnlinePeers extends Component {

  state = { active: false }

  render() {
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

    return <div className={`${className} onlinePeers onlinePeers--aligned-left`}>
      <div className="onlinePeers-count">
        <button className="onlinePeers-btn" onClick={() => this.setState({ active: !this.state.active })}>
          {onlinePeers.length} <UsersImg />
        </button>
      </div>
      <div className={`onlinePeers-wrap${this.state.active ? ' onlinePeers-wrap--active' : ''}`}>
        <h4 className="onlinePeers-title"><UsersImg className="onlinePeers-svg-inner" /> Devices Online</h4>
        <ul className="onlinePeers-list">
          {onlinePeers.map((peer, index) => {
            const count = onlinePeersNicknameCount.get(peer)
            innerCount.set(peer, innerCount.get(peer) + 1)
            return <li key={`online-peer-${peer}-${index}`} className="onlinePeers-item">
              <UserName str={peer} bgColor={colors[index]} /> {index === 0
                ? ' (you)'
                : count > 1 ? `(${innerCount.get(peer)})` : ''}
            </li>
          })}
        </ul>
      </div>
    </div>
  }
}

export default OnlinePeers
