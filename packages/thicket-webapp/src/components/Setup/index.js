import React, { Component } from 'react'
import uuid from 'uuid'
import { DEFAULT_PUBLICATIONS, DEFAULT_PUBLICATIONS_SIZE } from '../../utils/constants'
import { Spinner } from 'thicket-elements'
import store from '../../database/store'
import './Setup.css'

const { communities } = store

export default class Setup extends Component {

  async componentDidMount() {
    const { nickname } = this.props
    // new community
    const id = uuid()
    const community = await communities.post(id)
    community.post({ createdBy: nickname, size: DEFAULT_PUBLICATIONS_SIZE })
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
