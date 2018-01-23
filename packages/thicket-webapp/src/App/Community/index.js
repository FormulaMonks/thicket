import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { Input, Spinner } from 'thicket-elements'
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
import AddButton from '../../components/AddButton'
import { formatBytes } from '../../utils/sizeFormat'
import NotFound from '../404'
import NoContent from './NoContent'
import Leave from './Leave'
import shareSvg from './share.svg'
import './Community.css'

const { user, communities } = store
const CREATE = 'user is creating a gif'
const UNINVITED = 'user has not been invited to the community or the community does not exist'
const LEAVE = 'user is displayed the confirm box to leave the community'
const isItMobile = document.documentElement.clientWidth < 600

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
    shooting: false,
  }

  async componentDidMount() {
    const { c } = this.props.match.params
    // is the user coming from an invite link?
    const { token = '' } = queryString.parse(window.location.search);
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
    this.fetchMetadata()
    this.fetchPublications()
    this.fetchOnlinePeers()
    // subscribe
    const community = await communities.get(c)
    const { publications } = community
    community.on('update', this.fetchMetadata)
    community.on('peer', this.fetchOnlinePeers)
    publications.on('update', this.fetchPublications)
    // fix scroll when coming from communities
    window.scrollTo(0, 0)
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
      return <NotFound history={this.props.history} />
    }

    return [
      ((isItMobile && !mode && match.isExact) || !isItMobile) && <div key="community" className="community">
        <Link to="/communities" className="community__back">
          <h3><img className="community__arrow" src={back} alt="Your Communities" /> Your communities <img className="community__arrow--right" src={back} alt="Your Communities" /></h3>
        </Link>
        <Title title={title} onSubmit={this.onSaveTitle} />
        <OnlinePeers onlinePeers={onlinePeers} colors={colors} />
        <button className="community__leave community__btn" onClick={() => this.setState({ mode: LEAVE })}>
          <img src={leaveSvg} alt="Leave community" /><span className="community__leave-label">Leave</span>
        </button>
        <div className="community__size community__btn community__size--aligned-right">{formatBytes(size)}</div>
        <AddButton onClick={() => this.setState({ mode: CREATE })} className="community__new" />
        <div
          className="community__invite-wrap"
          title="Share the link with friends so they can join the community. NOTE: Anyone with this link can join and contribute content. Only send to reliable users and do not post publically."
        >
          <input
            className="community__invite"
            type="text"
            readOnly
            value={getCommunityInviteLink(c)}
            onClick={e => e.target.select()}
          />
          <img
            src={shareSvg}
            alt="Share this community"
            className="community__invite-img"
          />
        </div>
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
                onNew={() => this.setState({ mode: CREATE })}
              />
            : <NoContent onCreate={() => this.setState({ mode: CREATE })} />
        }
      </div>,
      mode === LEAVE && <Leave title={title} onLeave={this.onLeave} onCancel={() => this.setState({ mode: null })} />,
      mode === CREATE && <div
          key="create"
          className={`community__create${this.state.shooting ? ' community__create-onTop' : ''}`}
        >
          <CreateGif
            community={c}
            nickname={nickname}
            onSave={this.onSave}
            onShooting={shooting => this.setState({ shooting }) }
          />
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
