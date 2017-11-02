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
          cameraWrap: 'cameraWrap',
          videoWrap: 'videoWrap',
          controlsWrap: 'controlsWrap',
          controlsTitle: 'controlsTitle',
          controlsButton: 'controlsButton',
          progressLabel: 'progressLabel',
          progressBarWrap: 'progressBarWrap',
          progressBarBar: 'progressBarBar',
          loadingSpinner: 'loadingSpinner',
          loadingTitle: 'loadingTitle',
          loadingMessage: 'loadingMessage',
          reviewPreview: 'reviewPreview',
          reviewControlsWrap: 'reviewControlsWrap',
          reviewButton: 'reviewButton',
          reviewRedo: 'reviewRedo',
          reviewApprove: 'reviewApprove',
        }} 
      />
    ]
  }
}

render(<Demo/>, document.querySelector('#demo'))
