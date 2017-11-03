import React, { Component } from 'react'
import { Button } from 'thicket-elements'
import './Tos.css'

class Tos extends Component {

  state = { accepted: false }

  render() {
    const { accepted } = this.state

    return <div className="tos">
      <header className="tos__header">
        <h2>Please review the following terms:</h2>
        <h3>Before we begin, please read the Thicket Terms & Agreement information below. If everything checks out, click the check mark below and click Continue.</h3>
      </header>
      <p className="tos__terms">ToS</p>
      <label className="tos__check">
        <input type="checkbox" onChange={e => this.setState({ accepted: e.target.checked })} /> I agree to Thicket Terms & Agreement Information
      </label>
      <Button className={`${accepted ? '' : 'tos__accept--disabled'}`} disabled={!accepted} onClick={this.props.onContinue}>Continue</Button>
    </div>
  }
}

export default Tos
