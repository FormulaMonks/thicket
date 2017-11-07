import React, { Component } from 'react'
import Modal from '../Modal'
import { Button, Spinner } from 'thicket-elements'
import db from '../../database'
import './Publication.css'

const DOWNLOAD = 'show options for downloading'
const LINKS = 'show options for link sharing'

const Header = () =>
	<header className="publication__header">View / Edit your GIF</header>

const Footer = props => <footer>
	<Button>Delete GIF</Button>
	<Button>Save Changes</Button>
</footer>

class Main extends Component {

	state = { mode: null }

	render() {
		if (!this.props.gif) {
			return <Spinner />
		}

		return <div>
			<div>preview</div>	
			<div>nickname</div>	
			<div>caption</div>	
			<div>actions</div>
		</div>
	}
}

class Publication extends Component {
	
	state = { gif: null }

	componentDidMount() {
		db.publications.getById(this.props.match.params.id).then(gif => this.setState({ gif }))
	}

	render() {
		return <Modal
			header={<Header />}
			main={<Main gif={this.state.gif} />}
			footer={<Footer onSave={this.onSave} onDelete={this.onDelete} />}
			onClose={() => this.props.history.push(`/c/${this.props.match.params.c}`)}
		/>
	}

	onDelete = () => {}
	
	onSave = () => {}
}

export default Publication
