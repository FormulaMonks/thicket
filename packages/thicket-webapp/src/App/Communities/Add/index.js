import React, { Component } from 'react'
import { Styles } from 'thicket-elements'
import './Add.css'

const { linearGradient } = Styles

const Cross = props => <div className="add__cross">
  <div className="add__cross-vertical" style={{ background: linearGradient }}></div>
  <div className="add__cross-horizontal" style={{ background: linearGradient }}></div>
</div>

class Add extends Component {

  render() {
    return <div className="add__wrap" style={{ background: linearGradient }}>
      <div className="add__container">
        <button onClick={this.props.onClick} className="add__btnNew">
          Create New Community
          <Cross />
        </button>
      </div>
    </div>
  }
}

export default Add
