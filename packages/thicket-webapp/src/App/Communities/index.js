import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './Communities.css'

const CREATE = 'user is creating a community'

class Communities extends Component {

  state = { data: [], mode: null }

  render() {
    const { data, mode } = this.state

    return [
      <div className="communities" key="communities">
        <div className="communities__header">Your communities</div>
        <ul className="communities__grid" key="grid">
          <li key="new" onClick={() => this.setState({ mode: CREATE })}>New community</li>
            {data.map((item, index) => <li key={index}>
            <Link to={`/c/${index}`}>{index}</Link>
          </li>)}
        </ul>
      </div>,
      mode === CREATE && <div className="communities__create" key="create">CREATE</div>,
    ]
  }
}

export default Communities
