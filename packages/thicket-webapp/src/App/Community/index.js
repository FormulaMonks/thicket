import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Create from '../Create'

const ONBOARDING = 'show the user how to get things done around here'
const CREATING = 'user is creating a gif'
const INVITING = 'user is presented with a link to invite other to this community'

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
    mode: (() => {
      if (true) {
        return ONBOARDING
      }
      return ''
    })(),
    data: [],
    selectedGIF: null,
  }

  componentDidMount() {
    // fetch data for this community
  }

  render() {
    const { data, selectedGIF, mode } = this.state
    const { c } = this.props.match.params
    return [
      <div key="breadcrumbs"><Link to="/communities">Your communities</Link> ≫ {c}</div>,
      !!data.length && <Grid key="grid" data={data} onNew={() => this.setState({ mode: CREATING })} onSelect={selectedGIF => this.setState({ selectedGIF })} />,
      !data.length && <NoContent key="nocontent" onNew={() => this.setState({ mode: CREATING })} onInvite={() => this.setState({ mode: INVITING })}/>,
      selectedGIF && <div key="gif" onClick={() => this.setState({ selectedGIF: null })}>Close GIF</div>,
      mode === ONBOARDING && <div key="onboarding" onClick={() => this.setState({ mode: '' })}>Close community onboarding</div>,
      mode === CREATING && <Create key="create" community={c} onSave={() => this.setState({ mode: '', data: data.concat(data.length + 1) })} />,
      mode === INVITING && <div key="invite" onClick={() => this.setState({ mode: '' })}>Close invite</div>,
    ]
  }
}

export default Community
