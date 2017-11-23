import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { Button, Spinner } from 'thicket-elements'
import Grid from './Grid'
import FirstGIF from './FirstGIF'
import Create from '../../components/Create'
import Publication from './Publication'
import Settings from './Settings'
import Invite from './Invite'
import CanJoin from './CanJoin'
import './Community.css'
import add from './add.svg'
import link from './link.svg'
import settings from './settings.svg'
import usersvg from './user.svg'
import store from '../../database/store'
import queryString from 'query-string'

const { user, communities } = store
const CREATE = 'user is creating a gif'
const INVITE = 'user is presented with a link to invite other to this community'
const SETTINGS = 'user can modify the community title and/or leave the community'
const UNINVITED = 'user has not been invited to the community or the community does not exist'
const CAN_JOIN = 'user can join the community'

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
    list: [],
    title: '',
  }

  async componentDidMount() {
    const { c } = this.props.match.params
    // is the user coming from an invite link?
    const { token = '' } = queryString.parse(window.location.search);
    const canJoin = atob(token) === c
    const member = await communities.has(c)
    if (!member && canJoin) {
      this.setState({ mode: CAN_JOIN })
    }
    // uninvited?
    if (!member && !canJoin) {
      this.setState({ mode: UNINVITED })
      return
    }
    // get data
    this.fetchMetadata()
    this.fetchPublications()
    // subscribe
    const community = await communities.get(c)
    const { publications } = community
    community.on('update', this.fetchMetadata)
    publications.on('update', this.fetchPublications)
  }

  async componentWillUnmount() {
    const { c } = this.props.match.params
    const community = await communities.get(c)
    const { publications } = community
    community.off('update', this.fetchMetadata)
    publications.off('update', this.fetchPublications)
  }

  render() {
    const { list, mode, title, loading } = this.state
    const { nickname, match, history } = this.props
    const { c } = match.params

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
            !!list.length && <Grid key="grid" community={c} list={list} onNew={() => this.setState({ mode: CREATE })} />,
            !list.length && <NoContent key="nocontent" onNew={() => this.setState({ mode: CREATE })} onInvite={() => this.setState({ mode: INVITE })}/>
          ]}
        </div>
      </div>,
      <Route key="publication" exact path="/c/:c/:id" render={props => <Publication {...props} />} />,
      <Route key="first_gif" exact path="/c/:c/first-gif" render={() =>
        <FirstGIF onClose={() => history.replace(`/c/${c}`)} title={title} community={c} />} />,
      mode === CREATE &&
        <div key="create" className="community__create">
          <Create community={c} nickname={nickname} onSave={this.onSave} />
        </div>,
      mode === SETTINGS &&
        <Settings
          key="settings"
          onClose={() => this.setState({ mode: null })}
          title={title}
          communityId={c}
          history={history}
          />,
      mode === INVITE && <Invite key="invite" onClose={() => this.setState({ mode: null })} community={c} />,
      mode === CAN_JOIN && <CanJoin key="join" community={c} history={history} nickname={nickname} onClose={() => this.setState({ mode: null })} />
    ]
  }

  fetchPublications = async () => {
    const { publications } = await communities.get(this.props.match.params.c)
    const list = await publications.getAll()
    this.setState({ list, loading: false })
  }

  fetchMetadata = async () => {
    const community = await communities.get(this.props.match.params.c)
    const { title } = await community.get()
    this.setState({ title })
  }

  onSave = async data => {
    const { publications } = await communities.get(this.props.match.params.c)
    await publications.post(data)
    await user.put({ nickname: data.nickname })
    this.setState({ mode: null })
  }

}

export default Community
