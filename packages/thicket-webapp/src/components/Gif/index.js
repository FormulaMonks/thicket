import React, { Component } from 'react'
import { Icons, Icon, Styles, Spinner, ShareLink } from 'thicket-elements'
import { Trigger } from 'thicket-elements/lib/ShareLink'
import './Gif.css'
import Editable from '../Editable'
import streamSaver from 'streamsaver'
import ImageDataConverter from '../../utils/imageDataConverter'
import { getGIFLink } from '../../utils/links'

const { linearGradient, glow } = Styles
const { downloadSvg, shareSvg, facebookSvg, twitterSvg } = Icons
const isSafari = navigator.userAgent.toLowerCase().indexOf('safari/') > -1

const getFilename = ({ nickname, caption }) => `thicket${nickname ? `-${nickname}` : ''}${caption ? `-${caption}` : ''}.gif`

const downloadFile = gif => {
  const filename = getFilename(gif)
  const fileStream = streamSaver.createWriteStream(filename, gif.src.length)
  const writer = fileStream.getWriter()
  const data = new ImageDataConverter(gif.src).convertToTypedArray()
  writer.write(data)
  writer.close()
}

const Download = ({ gif, onShareHook }) => {

    if (document.documentElement.clientWidth < 600) {
      return null
    }

    // chrome
    if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
      return <button
        className="gif__button"
        onClick={() => onShareHook(() => downloadFile(gif))}
      >
        <Icon src={downloadSvg} />
      </button>
    }

    // safari & firefox
    return <a
      className="gif__button"
      download={getFilename(gif)}
      href={gif.src}
    >
      <Icon src={downloadSvg} />
    </a>

}

export default class Gif extends Component {

  state = { sharing: false }

  render() {
    const {
      onShareHook=cb=>cb(),
      gif,
      header,
      editable,
      onChange,
      communityId,
      children
    } = this.props
    const { sharing } = this.state

    if (!gif) {
      return <div className="gif__loading"><Spinner /></div>
    }

    const { src, nickname, caption, id } = gif
    const publicURL = getGIFLink(communityId, id)

    return <div className="gif__wrap" style={{ background: linearGradient, boxShadow: glow }}>
      <img className={`gif__img${isSafari ? ' gif__img--safari' : ''}`} src={src} alt={caption} />
      <div className="gif__inner">
        {header}
        {(nickname || editable) && [
          <h3 key="nickname_label">GIF created by:</h3>,
          editable
            ? <Editable key="nickname_input" value={nickname} onChange={e => onChange({ ...gif, nickname: e.currentTarget.value })} />
            : <div key="nickname_value">{nickname}</div>
        ]}
        {(caption || editable) && [
          <h3 key="caption_label">GIF caption:</h3>,
          editable
            ? <Editable key="caption_input" value={caption} onChange={e => onChange({ ...gif, caption: e.currentTarget.value })} />
            : <div key="caption_value">{caption}</div>
        ]}
        <h3>Save & Share GIF</h3>
        <div className="gif__buttons">
          <Download gif={gif} onShareHook={onShareHook} />
          <Trigger active={sharing}>
            <button
              className="gif__button"
              onClick={() => onShareHook(() => this.setState({ sharing: true }))}
            >
              <Icon src={shareSvg} />
            </button>
          </Trigger>
          {sharing && <ShareLink
            className="gif__share"
            title={"GIF Share Link"}
            body={"Share the link with friends so they view this GIF."}
            toCopy={publicURL}
            onBlur={() => this.setState({ sharing: false })}
          />}
          <button
            className="gif__button"
            onClick={() => onShareHook(() => window.open(`https://www.facebook.com/sharer.php?u=${publicURL}`, '_blank'))}
          >
            <Icon src={facebookSvg} />
          </button>
          <button
            className="gif__button"
            onClick={() => onShareHook(() => window.open(`https://www.twitter.com/intent/tweet?url=${publicURL}`, '_blank'))}
          >
            <Icon src={twitterSvg} />
          </button>
        </div>
        {children}
      </div>
    </div>
  }
}
