import React from 'react'
import { Link } from 'react-router-dom'
import add from './add.svg'
import './Grid.css'

const Grid = props => {

  return <ul className="communityGrid">
    <li key="new" className="communityGrid__element communityGrid__new">
			<button onClick={props.onNew} className="communityGrid__btnNew">
				<img src={add} alt="Create New GIF" />
				Create New GIF
			</button>
		</li>
    {props.data.map((item, index) =>
      <li key={item.id} className="communityGrid__element">
				<Link to={`${props.path}/${item.id}`} className="communityGrid__link">
					<img src={item.src || `https://ipfs.io/ipfs/${item.id}`} alt={item.caption} className="communityGrid__img" />
				</Link>
			</li>
    )}
  </ul>
}

export default Grid
