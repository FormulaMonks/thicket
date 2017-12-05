import React, { Component } from 'react'
import { Styles } from 'thicket-elements'
import './Add.css'

const { linearGradient, hoverLinearGradient, activeLinearGradient } = Styles

const Cross = ({ style }) => <div className="add__cross">
  <div className="add__cross-vertical" style={style}></div>
  <div className="add__cross-horizontal" style={style}></div>
</div>

class Add extends Component {

  state = { effect: null }

  render() {
    const { effect } = this.state
    const containerStyles = effect ? { border: 'none', height: '100%' } : {}
    const btnStyles = effect ? { background: effect, color: '#FFF' } : {}
    const crossStyles = { background: effect ? '#FFF' : linearGradient }

    return <div className="add__wrap" style={{ background: linearGradient }}>
      <div className="add__container" style={containerStyles}>
        <button
          onClick={this.props.onClick}
          className="add__btnNew"
          onMouseOver={() => this.setState({ effect: hoverLinearGradient })}
          onMouseOut={() => this.setState({ effect: null })}
          onMouseDown={() => this.setState({ effect: activeLinearGradient })}
          onMouseUp={() => this.setState({ effect: null })}
          style={btnStyles}
        >
          Create New Community
          <Cross style={crossStyles} />
        </button>
      </div>
    </div>
  }
}

export default Add
