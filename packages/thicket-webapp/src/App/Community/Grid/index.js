import React from 'react'
import { Link } from 'react-router-dom'
import { Styles, Spinner } from 'thicket-elements'
import prettydate from 'pretty-date'
import { PLACEHOLDER } from '../../../utils/constants'
import './Grid.css'

const { linearGradient } = Styles

const Grid = ({ community, list }) => <ul className="communityGrid">
  {list.map(({ id, src, caption, nickname, createdAt, ...rest }) =>
    <li key={id} className="communityGrid__element" style={{ background: linearGradient }}>
      <Link to={`/c/${community}/${id}`} className="communityGrid__link">
        <div className="communityGrid__wrap">
          <img
            src={src ? src : PLACEHOLDER}
            alt={caption}
            className="communityGrid__img"
          />
          {!src &&
            <div className="communityGrid__spin">
              <Spinner backgroundColor="#09131D" />
            </div>
          }
        </div>
        <div className="communityGrid__meta">
          <h3 className="communityGrid__caption">{caption}</h3>
          <div className="communityGrid__metadata">
            <div className="communityGrid__nickname">{nickname}</div>
            <div className="communityGrid__createdAt">{createdAt && prettydate.format(new Date(createdAt))}</div>
          </div>
        </div>
      </Link>
    </li>
  )}
</ul>

export default Grid
