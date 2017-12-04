import React, { Component } from 'react'
import { Input } from 'thicket-elements'
import edit from './edit.svg'
import './Editable.css'

class Editable extends Component {

  state = { edit: false }

  render() {
    const { value, onChange } = this.props

    if (this.state.edit) {
      return <Input onChange={onChange} value={value} />
    }

    return <div>{value}<img src={edit} alt="Edit" onClick={() => this.setState({ edit: true })} /></div>
  }
}

export default Editable
