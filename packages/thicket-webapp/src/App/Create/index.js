import React, { Component } from 'react'

const WAITING = 'user can start shooting a gif'
const SHOOTING = 'shooting gif'
const LOADING = 'gif has been captured, processing'
const REVIEWING = 'ask the user if they are satisfied with the gif'
const CUSTOMIZING = 'add metadata to the gif (username and label)'
const FIRST_GIF = 'onboard user to community if this was their first gif'

class Loading extends Component {
  componentDidMount() {
    setTimeout(this.props.onLoaded, 2000)
  }

  render() {
    return <div>Loading</div>
  }
}

class Shooting extends Component {
  componentDidMount() {
    setTimeout(this.props.onFinished, 2000)
  }

  render() {
    return <div>Shooting</div>
  }
}

class Create extends Component {

  state = { mode: WAITING, firstGIF: true }

  render() {
    const { mode } = this.state
    return [
      mode === WAITING && <div key="waiting" onClick={() => this.setState({ mode: SHOOTING })}>Shoot</div>,
      mode === SHOOTING && <Shooting key="shooting" onFinished={() => this.setState({ mode: LOADING })}/>,
      mode === LOADING && <Loading key="loading" onLoaded={() => this.setState({ mode: REVIEWING })}/>,
      mode === REVIEWING  && <div key="reviewing" onClick={() => this.setState({ mode: CUSTOMIZING })}>Redo / Approve</div>,
      mode === CUSTOMIZING && <div key="customizing" onClick={() => this.save()}>Customizing then Save</div>,
      mode === FIRST_GIF && <div key="first_gif" onClick={() => this.save()}>Close modal first gif</div>,
    ]
  }

  save = () => {
    // first gif?
    if (this.state.firstGIF) {
      this.setState({ mode: FIRST_GIF, firstGIF: false })
      return
    }
    this.props.onSave()
  }
}

export default Create
