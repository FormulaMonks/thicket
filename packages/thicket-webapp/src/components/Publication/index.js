import React, { Component } from 'react'
import './Publication.css'

const LOADING = 'fetching gif data'

class Publication extends Component {
	
	state = { mode: LOADING }

	componentDidMount() {
		//fetch
	}

	render() {
		return <div className="publication"></div>
	}
}

export default Publication
