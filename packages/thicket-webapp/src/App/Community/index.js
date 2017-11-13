import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { Button, Spinner } from 'thicket-elements'
import Grid from './Grid'
import FirstGIF from './FirstGIF'
import Onboarding from './Onboarding'
import Create from '../../components/Create'
import Publication from '../../components/Publication'
import Settings from './Settings'
import Invite from './Invite'
import './Community.css'
import add from './add.svg'
import link from './link.svg'
import settings from './settings.svg'
import usersvg from './user.svg'
import store from '../../database/store'
const { user, communities } = store

const FIRST_GIF = 'show the user info from their first gif'
const ONBOARD = 'show the user how to get things done around here'
const CREATE = 'user is creating a gif'
const INVITE = 'user is presented with a link to invite other to this community'
const SETTINGS = 'user can modify the community title and/or leave the community'
const UNINVITED = 'user has not been invited to the community or the community does not exist'

const NoContent = props => <div className="nocontent">
  <h2>Your Community doesn’t have content yet!</h2>
  <p>Create new GIFs or invite someone to the Community to create and contribute their own GIFs.</p>
  <Button onClick={props.onNew}><img src={add} alt="Create NEW GIF" />Create new GIF</Button>
  <Button onClick={props.onInvite}><img src={link} alt="Invite Link" />Invite Link</Button>
</div>

class Community extends Component {

  state = {
    mode: null,
    loading: true,
    data: [],
    title: '',
  }

  componentDidMount() {
    const { c } = this.props.match.params
    communities.has(c)
      .then(v => {
        if (!v) {
          this.setState({ mode: UNINVITED })
          return
        }

        this.fetchPublications()
        communities.get(c).then(({ publications }) => publications.on('update', this.fetchPublications))
        this.fetchMetadata()
        communities.get(c).then(community => community.on('update', this.fetchMetadata))
        this.setMode()
      })
  }

  componentWillUnmount() {
    if (this.state.mode !== UNINVITED) {
      const { c } = this.props.match.params
      communities.get(c).then(({ publications }) => publications.off('update', this.fetchPublications))
      communities.get(c).then(community => community.off('update', this.fetchMetadata))
    }
  }

  render() {
    const { data, mode, title, loading } = this.state
    const { c } = this.props.match.params

    if (mode === UNINVITED) {
      return <div>404</div>
    }

    return [
      <div className="community" key="community">
        <div className="community__breadcrumbs"><Link to="/communities">Your communities</Link> ≫ {title}</div>
        <div className="community__header">
          <h2 className="community__title">{this.state.title}</h2>
          <div className="community__controls">
            <img src={link} alt="Invite link" onClick={() => this.setState({ mode: INVITE })} />
            <img src={settings} alt="Settings" onClick={() => this.setState({ mode: SETTINGS })} />
            <img src={usersvg} alt="User" />
          </div>
        </div>
        <div className="community__body">
          {loading ? <Spinner /> : [
            !!data.length && <Grid key="grid" community={c} data={data} onNew={() => this.setState({ mode: CREATE })} />,
            !data.length && <NoContent key="nocontent" onNew={() => this.setState({ mode: CREATE })} onInvite={() => this.setState({ mode: INVITE })}/>
          ]}
        </div>
      </div>,
      <Route key="publication" exact path="/c/:c/:id" render={props => <Publication {...props} />} />,
      mode === CREATE &&
        <div key="create" className="community__create">
          <Create
            community={c}
            nickname={this.props.nickname}
            onSave={data => communities.get(c).then(({ publications }) =>
              publications.post(data)
                .then(() => user.put({ nickname: data.nickname }))
                .then(() => this.setState({ mode: null })))}
            />
        </div>,
      mode === SETTINGS &&
        <Settings
          key="settings"
          onClose={() => this.setState({ mode: null })}
          title={title}
          communityId={c}
          history={this.props.history}
          />,
      mode === INVITE && <Invite key="invite" onClose={() => this.setState({ mode: null })} />,
      mode === ONBOARD && <Onboarding key="onboard" onFinish={() => this.setState({ mode: null })} />,
      mode === FIRST_GIF && <FirstGIF key="first" onClose={this.setMode} title={title} community={c} />,
    ]
  }

  fetchPublications = () =>
    communities.get(this.props.match.params.c)
      .then(({ publications }) => publications.getAll()
        .then(data => this.setState({ data, loading: false })))

  fetchMetadata = () =>
    communities.get(this.props.match.params.c)
      .then(community => community.get())
      .then(({ title }) => this.setState({ title }))

  setMode = () =>
   user.get(({ hasDoneFirstGIF, hasDoneCommunityOnboarding }) =>
      this.setState({ mode: !hasDoneFirstGIF ? FIRST_GIF : !hasDoneCommunityOnboarding ? ONBOARD : this.state.mode }))

}

export default Community
