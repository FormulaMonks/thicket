import React, { Component } from 'react'
import { Button, Input, Spinner } from 'thicket-elements'
import './Gif.css'
import Editable from '../Editable'
import download from './download.svg'
import share from './share.svg'
import facebook from './facebook.svg'
import twitter from './twitter.svg'
import { getGIFLink } from '../../utils/links'
import streamSaver from 'streamsaver'
import ImageDataConverter from '../../utils/imageDataConverter'

const GIF = 'show GIF'
const DOWNLOAD = 'show options for downloading'
const SHARE = 'show options for link sharing'

class Gif extends Component {

  state = { mode: GIF }

  render() {
    if (!this.props.gif) {
      return <div className="gif__main"><Spinner /></div>
    }

    const { mode } = this.state
    const { gif, editable, onChange, communityId } = this.props
    const { src, nickname, caption, id } = gif

    return <div className="gif__main">
      {mode === GIF && <img src={src} alt={caption} />}
      {mode === DOWNLOAD && <div>
        <div>
          <div>Download</div>
          <Button onClick={() => this.setState({ mode: GIF })}>x</Button>
        </div>
        <div>
          <Button onClick={this.onDownload}>Download</Button>
        </div>
      </div>}
      {mode === SHARE && <div>
        <div>
          <div>Share</div>
          <Button onClick={() => this.setState({ mode: GIF })}>x</Button>
        </div>
        <Input value={getGIFLink(communityId, id)} readOnly />
      </div>}
      <div>
        <div>Created by:</div>
        {editable &&
          <Editable value={nickname} onChange={e => onChange({ ...gif, nickname: e.currentTarget.value })} />}
        {!editable &&
          <div>{nickname}</div>}
        <div>GIF caption:</div>
        {editable &&
          <Editable value={caption} onChange={e => onChange({ ...gif, caption: e.currentTarget.value })} />}
        {!editable &&
          <div>{caption}</div>}
        <div>Share GIF</div>
        <div>
          <button onClick={() => this.setState({ mode: DOWNLOAD })}>
            <img src={download} alt="Download" />
          </button>
          <button onClick={() => this.setState({ mode: SHARE })}>
            <img src={share} alt="Get Link" />
          </button>
          <a href={`https://www.facebook.com/sharer.php?u=${window.location.href}`} target="_blank"><img src={facebook} alt="Share on Facebook" /></a>
          <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank"><img src={twitter} alt="Tweet" /></a>
        </div>
      </div>
    </div>
  }

  onDownload = () => {
    const { gif } = this.props
    const filename = `thicket${gif.nickname ? `-${gif.nickname}` : ''}${gif.caption ? `-${gif.caption}` : ''}.gif`
    const fileStream = streamSaver.createWriteStream(filename)
    const writer = fileStream.getWriter()
    const data = new ImageDataConverter(this.props.gif.src).convertToTypedArray()
    writer.write(data)
    writer.close()
  }

}

export default Gif
