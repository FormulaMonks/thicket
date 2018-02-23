import React, { Component } from 'react'
import Gif from '../../components/Gif'
import store from '../../database/store'
import { Button } from 'thicket-elements'
import './Gif.css'

const { communities } = store

class IndividualGif extends Component {

  state = { gif: null, newUser: true }

  async componentDidMount() {
    const userCommunities = await communities.getAll()
    this.setState({ newUser: !userCommunities.length })
    const { publications } = await communities.get(this.props.match.params.c)
    const gif = await publications.get(this.props.match.params.g)
    this.setState({ gif })
  }

  render() {
    const { history, match } = this.props
    const { gif, newUser } = this.state
    const nickname = (gif && gif.nickname) || `Guest${Math.floor(1 + Math.random() * 1000)}`

    return <div className="individualGif">
      <div className="individualGif__wrap">
        <Gif
          className="individualGif__wrapper"
          gif={gif}
          communityId={match.params.c}
          header={<div className="individualGif__header">
            {newUser
              ? <h2 key="title">Welcome to Thicket!</h2>
              : <h2 key="title">Welcome back!</h2>}
            <h3 key="message">Check out this awesome GIF!</h3>
          </div>}
        />
      </div>
      <div className="individualGif__message">
      {newUser && [
        <h3 key="subtitle">{nickname} and lots of other users are using Thicket to create and share GIFs. Get started for yourself today!</h3>,
        <Button key="action" onClick={() => history.push('/setup')}>Check out Thicket</Button>,
      ]}
      {!newUser && [
        <h3 key="subtitle">Hope you enjoyed this GIF. Head back to Your Communities to create and add content!</h3>,
        <Button key="action" onClick={() => history.push('/communities')}>Your communities</Button>,
      ]}
      </div>
    </div>
  }
}

export default IndividualGif