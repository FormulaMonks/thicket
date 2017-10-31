import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const CREATING = 'user is creating a community'

class Communities extends Component {

  state = { data: [], mode: '' }

  render() {
    const { data, mode } = this.state
    return [
      <div key="breadcrumbs">Your communities</div>,
      <ul key="grid">
        <li key="new" onClick={() => this.setState({ mode: CREATING })}>New community</li>
        {data.map((item, index) => <li key={index}>
          <Link to={`/c/${index}`}>{index}</Link>  
        </li>)}
      </ul>,
      mode === CREATING && <div key="creating" onClick={() => this.setState({ mode: '', data: data.concat(data.length + 1) })}>Add new community</div>,
    ]
  }
}

export default Communities
