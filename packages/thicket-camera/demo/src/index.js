import React, {Component} from 'react'
import {render} from 'react-dom'

import Camera from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <h1>thicket-camera Demo</h1>
      <div style={{ width: 600, height: 600 }}>
        <Camera onSave={() => alert('saving yr gif!')}/>
      </div>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
