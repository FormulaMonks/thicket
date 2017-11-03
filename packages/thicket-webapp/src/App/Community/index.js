import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'thicket-elements'
import localForage from 'localforage'
import FirstGIF from './FirstGIF'
import Create from '../Create'
import db from '../../database'
import './Community.css'
import add from './add.svg'
import link from './link.svg'

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

const NoContent = props => <div className="nocontent">
  <h2 key="title">Your Community doesn’t have content yet!</h2>
  <p key="message">Create new GIFs or invite someone to the Community to create and contribute their own GIFs.</p>
  <Button key="new" onClick={props.onNew}><img src={add} alt="Create NEW GIF" />Create new GIF</Button>
  <Button key="invite" onClick={props.onInvite}><img src={link} alt="Invite Link" />Invite Link</Button>
</div>

class Community extends Component {

  state = {
    mode: '',
    data: [],
    selectedGIF: null,
    title: '',
  }

  componentDidMount() {
    //this.fetchPublications()
    this.fetchMetadata()
    db.on('update', this.fetchPublications)
    db.on('update', this.fetchMetadata)
    //this.setMode()
  }

  componentWillUnmount() {
    db.off('update', this.fetchPublications)
    db.off('update', this.fetchMetadata)
  }

  render() {
    const { data, selectedGIF, mode, title } = this.state
    const { c } = this.props.match.params
    return [
      <div className="community" key="community">
        <div className="community__breadcrumbs"><Link to="/communities">Your communities</Link> ≫ {title}</div>
        <div className="community__body">
          {!!data.length && <Grid data={data} onNew={() => this.setState({ mode: CREATE })} onSelect={selectedGIF => this.setState({ selectedGIF })} />}
          {!data.length && <NoContent onNew={() => this.setState({ mode: CREATE })} onInvite={() => this.setState({ mode: INVITE })}/>}
        </div>
      </div>,
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
