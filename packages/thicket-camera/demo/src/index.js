import React, {Component} from 'react'
import {render} from 'react-dom'

import Camera from '../../src'

class Demo extends Component {
  render() {
    return <div>
      <h1>thicket-camera Demo</h1>
      <p>
        The camera is sized to its container. The thicket-camera component is
        only the part inside the dashed border.
      </p>
      <div style={{ width: 500, height: 400, border: '3px dashed' }}>
        <Camera onSave={() => alert('saving yr gif!')} />
      </div>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
