import React from 'react'
import { Link } from 'react-router-dom'
import add from './add.svg'
import './Grid.css'

const Grid = props => <ul className="communityGrid">
  <li key="new" className="communityGrid__element">
    <button onClick={props.onNew} className="communityGrid__btnNew">
      <img src={add} alt="Create New GIF" />
      Create New GIF
    </button>
  </li>
  {props.list.map((item, index) =>
    <li key={item.id} className="communityGrid__element">
      <Link to={`/c/${props.community}/${item.id}`} className="communityGrid__link">
        <img src={item.src} alt={item.caption} className="communityGrid__img" />
      </Link>
    </li>
  )}
</ul>

export default Grid
