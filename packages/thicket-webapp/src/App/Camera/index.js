import React from 'react'
import Camera from 'thicket-camera'

import { saveImage } from '../syncedDB'

export default ({ history }) =>
  <Camera
    onSave={
      data => saveImage(data).then(() => history.push('/'))
    }
  />
