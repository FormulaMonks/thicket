import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import localForage from 'localforage'
import './Communities.css'
import placeholder from './placeholder.png'
import add from './add.svg'

const CREATE = 'user is creating a community'

class Communities extends Component {

  state = { data: [], mode: null }

  componentDidMount() {
    localForage.getItem('communities').then(data => this.setState({ data: data || [] }))
  }

  render() {
    const { data, mode } = this.state

    return [
      <div className="communities" key="communities">
        <div className="communities__header">Your communities</div>
        <ul className="communities__grid" key="grid">
          <li key="new" className="communities__element">
            <button onClick={() => this.setState({ mode: CREATE })} className="communities__btnNew">
              <img src={add} alt="Create New Community" />
               Create New Community
            </button>
          </li>
          {data.map(item => <li key={item} className="communities__element">
            <Link to={`/c/${item}`} className="communities__link">
              <img src={placeholder} alt="" className="communities__img" />
            </Link>
          </li>)}
        </ul>
      </div>,
      mode === CREATE && <div className="communities__create" key="create">CREATE</div>,
    ]
  }
}

export default Communities
