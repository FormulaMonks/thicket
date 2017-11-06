import React, { Component } from 'react'
import localForage from 'localforage'

const close = cb =>
	localForage.setItem('hasDoneCommunityOnboarding', true).then(cb)

class Onboarding extends Component {

	state = { step: 0 }

	render() {
		// TODO: render modals/tooltip/information depending on which step is taking place
		// when done, call props.onFinish
		return null
	}
}

export default Onboarding
