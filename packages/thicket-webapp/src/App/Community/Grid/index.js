import React from 'react'
import { Link } from 'react-router-dom'
import { Styles } from 'thicket-elements'
import prettydate from 'pretty-date'
import './Grid.css'

const { linearGradient } = Styles

const Grid = ({ community, list }) => <ul className="communityGrid">
  {list.map(({ id, src, caption, nickname, createdAt, ...rest }) =>
    <li key={id} className="communityGrid__element" style={{ background: linearGradient }}>
      <Link to={`/c/${community}/${id}`} className="communityGrid__link">
        <img src={src} alt={caption} className="communityGrid__img" />
        <div className="communityGrid__meta">
          <h3 className="communityGrid__caption">{caption}</h3>
          <div className="communityGrid__metadata">
            <div>{nickname}</div>
            <div>{prettydate.format(new Date(createdAt))}</div>
          </div>
        </div>
      </Link>
    </li>
  )}
</ul>

export default Grid
