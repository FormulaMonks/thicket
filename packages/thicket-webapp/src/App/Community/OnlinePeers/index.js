import React, { Component } from 'react'
import usersSvg from './users.svg'
import './OnlinePeers.css'

class OnlinePeers extends Component {

  state = { active: false }

  render() {
    const { onlinePeers, colors } = this.props
    const innerCount = new Map()
    const onlinePeersNicknameCount = onlinePeers.reduce((p, c) => {
      if (!p.has(c)) {
        p.set(c, 0)
        innerCount.set(c, 0)
      }
      p.set(c, p.get(c) + 1)
      return p
    }, new Map())

    return <div className="onlinePeers onlinePeers--aligned-left">
     <div className="onlinePeers-count">
        <button className="onlinePeers-btn" onClick={() => this.setState({ active: !this.state.active })}>
          {onlinePeers.length} <img src={usersSvg} alt="Online Peers" />
        </button>
     </div>
     <div className={`onlinePeers-wrap${this.state.active ? ' onlinePeers-wrap--active' : ''}`}>
       <h4 className="onlinePeers-title">Browsers Online</h4>
       <ul className="onlinePeers-list">
         {onlinePeers.map((peer, index) => {
           const count = onlinePeersNicknameCount.get(peer)
           innerCount.set(peer, innerCount.get(peer) + 1)
           return <li key={`online-peer-${peer}-${index}`} className="onlinePeers-item">
             <span className="onlinePeers-initial" style={{ background: colors[index]}}>
               {peer.substr(0, 1)}
             </span> {peer} {index === 0
               ? '(you)'
               : count > 1 ? `(${innerCount.get(peer)})` : ''}
           </li>
         })}
       </ul>
     </div>
   </div>
  }
}

export default OnlinePeers
