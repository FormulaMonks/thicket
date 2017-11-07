import React, { Component } from 'react'
import edit from './edit.svg'
import './Editable.css'

class Editable extends Component {

	state = { edit: false }

	render() {
		const { value, onChange } = this.props

		if (this.state.read) {
			return <input type="text" onChange={onChange} value={value} />
		}

		return <div>{value}<img src={edit} alt="Edit" onClick={() => this.setState({ edit: true })} /></div>
	}
}

export default Editable
