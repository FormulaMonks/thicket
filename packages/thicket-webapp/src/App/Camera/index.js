import React from 'react'
import Camera from 'thicket-camera'

import { saveImage } from '../syncedDB'

export default ({ history, community }) =>
  <Camera
    onSave={
      data => saveImage(data, community).then(() => history.push('/'))
    }
  />
