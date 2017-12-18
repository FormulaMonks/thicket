import React from 'react'
import { Icons, Icon, Styles, Spinner } from 'thicket-elements'
import './Gif.css'
import Editable from '../Editable'
import streamSaver from 'streamsaver'
import ImageDataConverter from '../../utils/imageDataConverter'

const { linearGradient, glow } = Styles
const { downloadSvg, shareSvg, facebookSvg, twitterSvg } = Icons

const downloadFile = gif => {
  const filename = `thicket${gif.nickname ? `-${gif.nickname}` : ''}${gif.caption ? `-${gif.caption}` : ''}.gif`
  const fileStream = streamSaver.createWriteStream(filename)
  const writer = fileStream.getWriter()
  const data = new ImageDataConverter(gif.src).convertToTypedArray()
  writer.write(data)
  writer.close()
}

export default ({ gif, header, editable, onChange, communityId }) => {
  if (!gif) {
    return <div className="gif__loading"><Spinner /></div>
  }

  const { src, nickname, caption } = gif

  return <div className="gif__wrap" style={{ background: linearGradient, boxShadow: glow }}>
    <img className="gif__img" src={src} alt={caption} />
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
        <button className="gif__button" onClick={() => downloadFile(gif)}>
          <Icon src={downloadSvg} />
        </button>
        <button className="gif__button" onClick={() => {}}>
          <Icon src={shareSvg} />
        </button>
        <a href={`https://www.facebook.com/sharer.php?u=${window.location.href}`} target="_blank"><Icon src={facebookSvg} /></a>
        <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target="_blank"><Icon src={twitterSvg} /></a>
      </div>
    </div>
  </div>
}
