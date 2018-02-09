import React, { Component } from 'react'
import uuid from 'uuid'
import { DEFAULT_PUBLICATIONS, COMMUNITY_NAMES } from '../../utils/constants'
import { Spinner } from 'thicket-elements'
import store from '../../database/store'
import './Setup.css'

const { communities } = store
const randomName = COMMUNITY_NAMES[Math.floor(Math.random() * COMMUNITY_NAMES.length)]

export default class Setup extends Component {

  async componentDidMount() {
    const { nickname } = this.props
    // new community
    const id = uuid()
    const community = await communities.post(id)
    community.put({ createdBy: 'Thicket', title: randomName })
    const { publications } = community
    for(let p of DEFAULT_PUBLICATIONS) {
      await publications.postByHash({ ...p, nickname })
    }
    // redirect to community
    this.props.history.replace(`/c/${id}`)
  }

  render() {
    return <div className="setup"><Spinner /></div>
  }
}
