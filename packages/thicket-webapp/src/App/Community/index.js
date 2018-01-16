import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { Styles, Input, Modal, Spinner } from 'thicket-elements'
import Grid from './Grid'
import CreateGif from '../../components/CreateGif'
import Publication from './Publication'
import OnlinePeers from './OnlinePeers'
import leaveSvg from './leave.svg'
import store from '../../database/store'
import queryString from 'query-string'
import { getCommunityInviteLink } from '../../utils/links'
import back from '../../images/arrow-left.svg'
import randomColor from 'randomcolor'
import './Community.css'

const { linearGradient } = Styles
const { user, communities } = store
const CREATE = 'user is creating a gif'
const UNINVITED = 'user has not been invited to the community or the community does not exist'
const LEAVE = 'user is displayed the confirm box to leave the community'
const isItMobile = document.documentElement.clientWidth < 600

const formatBytes = a => {
  if (0 === a) return ''
  const c = 1024
  const d = 2
  const e = ['B','KB','MB','GB','TB','PB','EB','ZB','YB']
  const f = Math.floor(Math.log(a) / Math.log(c))
  const v = parseFloat((a / Math.pow(c, f)).toFixed(d))
  return (v > 0) ? `${v}${e[f]}` : ''
}

class Title extends Component {
  constructor(props) {
    super(props)
    this.state = { title: props.title }
  }

  componentWillReceiveProps({ title='' }) {
    this.setState({ title })
  }

  render() {
    const { title } = this.state
    return <form onSubmit={this.onSubmit} className="community__form">
      <Input
        type="text"
        placeholder="Name this Community"
        value={title}
        onChange={e => this.setState({ title: e.currentTarget.value })}
        onBlur={this.onSubmit}
      />
    </form>
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.onSubmit(this.state.title)
  }
}

class Community extends Component {

  state = {
    mode: null,
    loading: true,
    list: [],
    title: '',
    onlinePeers: [],
    size: 0,
    colors: [],
  }

  async componentDidMount() {
    const { c } = this.props.match.params
    // is the user coming from an invite link?
    const { token = '' } = queryString.parse(window.location.search);
    const canJoin = atob(token) === c
    const member = await communities.has(c)
    if (!member && canJoin) {
      await communities.post(c)
    }
    // uninvited?
    if (!member && !canJoin) {
      this.setState({ mode: UNINVITED })
      return
    }
    // get data
    this.fetchMetadata()
    this.fetchPublications()
    this.fetchOnlinePeers()
    // subscribe
    const community = await communities.get(c)
    const { publications } = community
    community.on('update', this.fetchMetadata)
    community.on('peer', this.fetchOnlinePeers)
    publications.on('update', this.fetchPublications)
  }

  async componentWillUnmount() {
    const { c } = this.props.match.params
    const community = await communities.get(c)
    const { publications } = community
    community.off('update', this.fetchMetadata)
    community.off('peer', this.fetchOnlinePeers)
    publications.off('update', this.fetchPublications)
  }

  render() {
    const { list, mode, title, loading, onlinePeers, size, colors } = this.state
    const { nickname, match } = this.props
    const { c } = match.params

    if (mode === UNINVITED) {
      return <div>404</div>
    }

    return [
      ((isItMobile && !mode && match.isExact) || !isItMobile) && <div key="community" className="community">
        <Link to="/communities" className="community__back">
          <img className="community__arrow" src={back} alt="Your Communities" /> Your communities <img className="community__arrow--right" src={back} alt="Your Communities" /> 
        </Link>
        <Title title={title} onSubmit={this.onSaveTitle} />
        <OnlinePeers onlinePeers={onlinePeers} colors={colors} />
        <button className="community__leave community__btn" onClick={() => this.setState({ mode: LEAVE })}>
          <img src={leaveSvg} alt="Leave community" /><span className="community__leave-label">Leave</span>
        </button>
        <div className="community__size community__btn community__size--aligned-right">{formatBytes(size)}</div>
        <button className="community__new community__btn community__new--aligned-right" style={{ background: linearGradient }} onClick={() => this.setState({ mode: CREATE })}>
          <div className="community__cross">
            <div className="community__cross-vertical"></div>
            <div className="community__cross-horizontal"></div>
          </div>
        </button>
        <input className="community__invite" type="text" readOnly value={getCommunityInviteLink(c)} />
        {loading ? <Spinner className="community__spinner" /> : <Grid key="grid" community={c} list={list} onNew={() => this.setState({ mode: CREATE })} />}
      </div>,
      mode === LEAVE && <Modal key="leave">
        <h3>Leave Community?</h3>
        <div>Are you sure you want to leave the "{title}" Community?</div>
        <div>Note: You will no longer be able to view or contribute content to this Community. Content will remain in the Community, but you will need to be reinvited to rejoin.</div>
        <button onClick={this.onLeave}>Leave Community</button>
        <button onClick={() => this.setState({ mode: null })}>Cancel</button>
      </Modal>,
      mode === CREATE && <div key="create" className="community__create">
          <CreateGif community={c} nickname={nickname} onSave={this.onSave} />
        </div>,
      <Route
        key="publication"
        exact
        path="/c/:c/:id"
        render={props => <Publication {...props} title={title} />}
      />,
    ]
  }

  fetchPublications = async () => {
    const { publications } = await communities.get(this.props.match.params.c)
    const list = await publications.getAll()
    this.setState({ list, loading: false })
  }

  fetchMetadata = async () => {
    const community = await communities.get(this.props.match.params.c)
    const { title, size } = await community.get()
    this.setState({ title, size })
  }

  fetchOnlinePeers = async () => {
    const { c } = this.props.match.params
    const community = await communities.get(c)
    const onlinePeers = await community.getOnlinePeers()
    const colors = randomColor({
      count: onlinePeers.length + 1,
      luminosity: 'bright',
      seed: c,
    })
    this.setState({ onlinePeers, colors })
  }

  onSave = async data => {
    const community = await communities.get(this.props.match.params.c)
    await community.postPublication(data)
    await user.put({ nickname: data.nickname })
    this.setState({ mode: null })
  }

  onSaveTitle = async title => {
    const community = await communities.get(this.props.match.params.c)
    community.put({ title })
  }

  onLeave = async () => {
    const { history, match } = this.props
    await communities.delete(match.params.c)
    history.replace('/communities')
  }

}

export default Community
