import React, { Component } from 'react'
import Gif from '../../components/Gif'
import store from '../../database/store'
import { Button } from 'thicket-elements'
import './Gif.css'

const { communities } = store

class G extends Component {

  state = { gif: null, newUser: true }

  async componentDidMount() {
    const userCommunities = await communities.getAll()
    this.setState({ newUser: !userCommunities.length })
    const { publications } = await communities.get(this.props.match.params.c)
    const gif = await publications.get(this.props.match.params.g)
    this.setState({ gif })
  }

  render() {
    const { history } = this.props
    const { gif, newUser } = this.state
    const nickname = (gif && gif.nickname) || `Guest${Math.floor(1 + Math.random() * 1000)}`
    return <div className="gif">
      <div>Welcome, check out this GIF!</div>
      <Gif gif={gif} />
      {newUser && <div>
        <div>{nickname} and lots of other users are using Thicket to create and share GIFs. 
Get started for yourself today!</div>
        <Button onClick={() => history.push('/welcome')}>Check out Thicket</Button>
      </div>}
      {!newUser && <div>
        <div>Hope you enjoyed this GIF. Head back to Your Communities to create and add content!</div>
        <Button onClick={() => history.push('/communities')}>Your communities</Button>
      </div>}
    </div>
  }
}

export default G
