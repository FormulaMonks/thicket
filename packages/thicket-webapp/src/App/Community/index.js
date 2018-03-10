import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { Button, Input, Spinner, Styles } from 'thicket-elements'
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
import { formatBytes } from '../../utils/sizeFormat'
import NotFound from '../404'
import NoContent from './NoContent'
import Leave from '../../components/Leave'
import shareSvg from './share.svg'
import { isMobile } from '../../utils/constants'
import './Community.css'

const { user, communities } = store
const { linearGradient } = Styles
const CREATE = 'user is creating a gif'
const UNINVITED = 'user has not been invited to the community or the community does not exist'
const LEAVE = 'user is displayed the confirm box to leave the community'

const LeaveBtn = ({ ctx }) => <button
  className="community__leave"
  onClick={() => ctx.safeSetState({ mode: LEAVE })}
>
  <img
    src={leaveSvg}
    alt="Leave community"
  />
  <span className="community__leave-label">
      Leave
  </span>
</button>

class Title extends Component {
  constructor(props) {
    super(props)
    this.state = { title: props.title }
  }

  componentWillReceiveProps({ title='' }) {
    this.setState({ title })
  }

  render() {
    const { syncing } = this.props
    const { title } = this.state
    return <form onSubmit={this.onSubmit} className="community__form">
      <Input
        className={`community__name${syncing ? ' community__form-syncing' : ''}`}
        type="text"
        placeholder={syncing ? 'Syncing Community...' : 'Name this Community'}
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
    syncing: false,
    list: [],
    title: '',
    onlinePeers: [],
    size: 0,
    colors: [],
    shooting: false,
  }

  async componentDidMount() {
    const { match, location, blacklistedCommunities=[] } = this.props
    const { c } = match.params
    const { token = '', leave = false } = queryString.parse(location.search);
    // if blacklisted no fetching data but let the user get the 404
    if (blacklistedCommunities.includes(c)) {
      this.setState({ loading: false })
      return
    }
    // leave & redirect
    if (leave) {
      this.onLeave()
      return
    }
    // is the user coming from an invite link?
    const canJoin = atob(token) === c
    const member = await communities.has(c)
    if (!member && canJoin) {
      await communities.post(c)
      this.props.history.replace(`/c/${c}`)
    }
    // uninvited?
    if (!member && !canJoin) {
      this.setState({ mode: UNINVITED })
      return
    }
    // get data
    this.fetchAll()
    // subscribe
    const community = await communities.get(c)
    const { publications } = community
    community.on('update', this.fetchMetadata)
    community.on('peer', this.fetchOnlinePeers)
    community.on('syncing', this.onSyncing)
    community.on('synced', this.onSynced)
    community.on('update', this.fetchPublicationsMetadata)
    publications.on('update', this.fetchPublicationsMetadata)
    // fix scroll when coming from communities
    window.scrollTo(0, 0)
  }

  async componentWillUnmount() {
    const { c } = this.props.match.params
    const community = await communities.get(c)
    const { publications } = community
    community.off('update', this.fetchMetadata)
    community.off('peer', this.fetchOnlinePeers)
    community.off('syncing', this.onSyncing)
    community.off('synced', this.onSynced)
    community.off('update', this.fetchPublicationsMetadata)
    publications.off('update', this.fetchPublicationsMetadata)
  }

  render() {
    const {
      list,
      mode,
      title,
      loading,
      onlinePeers,
      size,
      colors,
      syncing,
    } = this.state
    const {
      history,
      nickname,
      match,
      onInviteHook=cb=>cb(),
      blacklistedCommunities=[],
      communityBtns,
    } = this.props
    const { c } = match.params

    if (mode === UNINVITED || blacklistedCommunities.includes(c)) {
      return <NotFound history={history} />
    }

    return [
      ((isMobile && !mode && match.isExact) || !isMobile) && <div key="community" className="community">
        <Link
          ref={n => this.node = n}
          to="/communities"
          className="community__back"
        >
          <h3>
            <img
              className="community__arrow"
              src={back}
              alt="Your Communities"
            />
            Your communities
            <img
              className="community__arrow--right"
              src={back}
              alt="Your Communities"
            />
          </h3>
        </Link>
        <Title
          syncing={syncing}
          title={title}
          onSubmit={this.onSaveTitle}
        />
        <OnlinePeers
          className="community__onlinePeers"
          onlinePeers={onlinePeers}
          colors={colors}
        />
        <div className="community__btns">
          {communityBtns.map((B, i) => <B key={i} ctx={this} />)}
        </div>
        <div className="community__size">
          {syncing
            ? <small className="community__size-syncing">Syncing Data...</small>
            : formatBytes(size)
          }
        </div>
        <Button
          onClick={this.onCreateGif}
          className={`community__new${list.length ? '' : '--empty'}`}
        >
          Create GIF
        </Button>
        <div
          className="community__invite-wrap"
          title="Share the link with friends so they can join the community. NOTE: Anyone with this link can join and contribute content. Only send to reliable users and do not post publically."
          style={{ background: linearGradient }}
        >
          <input
            className="community__invite"
            ref={i => this.input = i}
            type="text"
            readOnly
            value={getCommunityInviteLink(c)}
            onClick={e => onInviteHook(() => this.input.setSelectionRange(0, 9999))}
          />
          <img
            src={shareSvg}
            alt="Share this community"
            className="community__invite-img"
          />
        </div>
        <div className="community__content-wrap">
          {loading
            ? <div
                key="spinner"
                className="community__spinner"
              >
                <Spinner />
              </div>
            : list.length
              ? <Grid
                  key="grid"
                  community={c}
                  list={list}
                  onNew={this.onCreateGif}
                />
              : <NoContent
                  syncing={syncing}
                  onCreate={this.onCreateGif}
                />
          }
        </div>
      </div>,
      mode === LEAVE && <Leave
          key="leave"
          title={title}
          onLeave={this.onLeave}
          onCancel={() => this.setState({ mode: null })}
        />,
      mode === CREATE && <div
          key="create"
          className={`community__create${this.state.shooting ? ' community__create-onTop' : ''}`}
        >
          <CreateGif
            ref={n => this.node = n}
            community={c}
            nickname={nickname}
            onSave={this.onSave}
            onShooting={shooting => this.setState({ shooting }) }
            onCancel={this.onStopCreateGif}
          />
        </div>,
      <Route
        key="publication"
        exact
        path="/c/:c/:id"
        render={props =>
          <Publication
            {...props}
            title={title}
            onShareHook={this.props.onShareHook}
          />}
      />,
    ]
  }

  fetchAll = () => {
    this.fetchMetadata()
    this.fetchOnlinePeers()
    this.fetchPublicationsMetadata()
  }

  fetchMetadata = async () => {
    const community = await communities.get(this.props.match.params.c)
    const { title, size } = await community.get()
    this.safeSetState({ title, size })
  }

  fetchPublications = async () => {
    const community = await communities.get(this.props.match.params.c)
    const list = await community.getAllPublications()
    this.safeSetState({ list })
    // side effect
    // size changed, and we only know the new size
    // after receiving the publications
    this.fetchMetadata()
  }

  fetchPublicationsMetadata = async () => {
    const { publications } = await communities.get(this.props.match.params.c)
    const list = await publications.getMetadata()
    const mergedList = list.map(item => {
      const exists = this.state.list.find(i => i.id === item.id)
      return exists ? { ...exists, ...item } : item
    })
    this.safeSetState({ list: mergedList, loading: false }, this.fetchPublications)
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
    this.safeSetState({ onlinePeers, colors })
  }

  onCreateGif = () => {
    const { onCreateGif=()=>{} } = this.props
    onCreateGif(true)
    this.safeSetState({ mode: CREATE })
  }

  onStopCreateGif = () => {
    const { onCreateGif=()=>{} } = this.props
    onCreateGif(false)
    this.safeSetState({ mode: null })
  }

  onSave = async data => {
    const community = await communities.get(this.props.match.params.c)
    await community.postPublication(data)
    await user.put({ nickname: data.nickname })
    this.onStopCreateGif()
  }

  onSaveTitle = async title => {
    const community = await communities.get(this.props.match.params.c)
    community.put({ title })
  }

  onSyncing = () => {
    this.safeSetState({ syncing: true })
  }

  onSynced = async () => {
    this.fetchAll()
    this.safeSetState({ syncing: false })
  }

  onLeave = async () => {
    const { history, match } = this.props
    await communities.delete(match.params.c)
    history.replace('/communities')
  }

  safeSetState = (state, cb=()=>{}) => {
    if (this.node) {
      this.setState({ ...state }, cb)
    }
  }

}

export default ({ communityBtnsHook=x => x, ...props  }) =>
  <Community
    communityBtns={communityBtnsHook([LeaveBtn])}
    {...props}
  />
