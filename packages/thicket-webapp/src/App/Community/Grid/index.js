import React from 'react'
import { Styles } from 'thicket-elements'
import prettydate from 'pretty-date'
import TimedGif from '../../../components/TimedGif'
import './Grid.css'

const { linearGradient } = Styles

const Grid = ({ community, list, history }) =>
  <ul
    data-test="community-grid"
    className="communityGrid"
  >
    {list.map(({ id, src, caption, nickname, createdAt, ...rest }, index) =>
      <li
        key={`communityGrid-${id}-${index}`}
        data-test="community-grid-element"
        className="communityGrid__element"
        style={{ background: linearGradient }}
      >
        <div className="communityGrid__wrap">
          <TimedGif
            onClick={() => history.push(`/c/${community}/${id}`)}
            src={src}
            alt={caption}
            className="communityGrid__img"
            controlable={true}
            autoPlay={true}
          />
        </div>
        <div className="communityGrid__meta">
          <h3
            data-test="community-grid-caption"
            className="communityGrid__caption"
          >
            {caption}
          </h3>
          <div className="communityGrid__metadata">
            <div
              data-test="community-grid-nickname"
              className="communityGrid__nickname"
            >
              {nickname}
            </div>
            <div className="communityGrid__createdAt">{createdAt && prettydate.format(new Date(createdAt))}</div>
          </div>
        </div>
      </li>
    )}
  </ul>

export default Grid
