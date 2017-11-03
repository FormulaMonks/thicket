import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import localForage from 'localforage'
import FirstGIF from './FirstGIF'
import Create from '../Create'
import db from '../../database'

const FIRST_GIF = 'show the user info from their first gif'
const ONBOARD = 'show the user how to get things done around here'
const CREATE = 'user is creating a gif'
const INVITE = 'user is presented with a link to invite other to this community'

const Grid = props => {
  return <ul>
    <li key="new" onClick={props.onNew}>New Gif</li>
    {props.data.map((item, index) =>
      <li onClick={() => props.onSelect(item)} key={index}>Gif #{index+1} </li>
    )}
  </ul>
}

const NoContent = props => <div>
  <div>Your community doesn't have content</div>
  <div onClick={props.onNew}>Create new GIF</div>
  <div onClick={props.onInvite}>Invite Link</div>
</div>

class Community extends Component {

  state = {
    mode: '',
    data: [],
    selectedGIF: null,
    title: '',
  }

  componentDidMount() {
    this.fetchPublications()
    this.fetchMetadata()
    db.on('update', this.fetchPublications)
    db.on('update', this.fetchMetadata)
    this.setMode()
  }

  componentWillUnmount() {
    db.off('update', this.fetchPublications)
    db.off('update', this.fetchMetadata)
  }

  render() {
    const { data, selectedGIF, mode, title } = this.state
    const { c } = this.props.match.params
    return [
      <div key="breadcrumbs"><Link to="/communities">Your communities</Link> ≫ {title}</div>,
      !!data.length && <Grid key="grid" data={data} onNew={() => this.setState({ mode: CREATE })} onSelect={selectedGIF => this.setState({ selectedGIF })} />,
      !data.length && <NoContent key="nocontent" onNew={() => this.setState({ mode: CREATE })} onInvite={() => this.setState({ mode: INVITE })}/>,
      selectedGIF && <div key="gif" onClick={() => this.setState({ selectedGIF: null })}>Close GIF</div>,
      mode === CREATE && <Create key="create" community={c} onSave={() => this.setState({ mode: '', data: data.concat(data.length + 1) })} />,
      mode === INVITE && <div key="invite" onClick={() => this.setState({ mode: '' })}>Close invite</div>,
      mode === ONBOARD && <div key="onboard" onClick={() => this.setState({ mode: '' })}>Close community onboarding</div>,
      mode === FIRST_GIF && <FirstGIF key="first" onClose={this.setMode} title={title} community={c} />,
    ]
  }

  fetchPublications = c => {
    db.publications.get(this.props.match.params.c)
      .then(data => this.setState({ data }))
  }

  fetchMetadata = c => {
    db.metadata.get(this.props.match.params.c)
      .then(({ title }) => this.setState({ title }))
  }

  setMode = () => {
    localForage.getItem('hasDoneFirstGIF').then(f =>
      localForage.getItem('communityOnboarding').then(o =>
        this.setState({ mode: !f ? FIRST_GIF : !o ? ONBOARD : '' })))
  }
}

export default Community
