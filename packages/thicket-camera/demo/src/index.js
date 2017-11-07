import React, {Component} from 'react'
import {render} from 'react-dom'

import Camera from '../../src'
import './styles.css'

class Demo extends Component {
  render() {
    return [
      <h1 key="title">thicket-camera Demo</h1>,
      <Camera
        key="camera"
        onSave={() => alert('saving yr gif!')}
        classNames={{
          cameraWrap: '',
          videoWrap: '',
          controlsWrap: '',
          controlsTitle: '',
          controlsButton: '',
          progressLabel: '',
          progressBarWrap: '',
          progressBarBar: '',
          loadingSpinner: '',
          loadingTitle: '',
          loadingMessage: '',
          reviewPreview: '',
          reviewControlsWrap: '',
          reviewButton: '',
          reviewRedo: '',
          reviewApprove: '',
        }} 
      />
    ]
  }
}

render(<Demo/>, document.querySelector('#demo'))
