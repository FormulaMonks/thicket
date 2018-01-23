import React from 'react'
import { Button } from 'thicket-elements'
import './Delete.css'

export default ({ caption, onDelete, onCancel }) => <div className="delete">
  <h2 className="delete__title">Are you sure?</h2>
  <div className="delete__msgs">Are you sure you want to delete the GIF titled <span className="delete__caption">{caption}</span>?</div>
  <div className="delete__msgs">NOTE: this action cannot be undone</div>
  <div className="delete__btns">
    <Button
      className="delete__confirm"
      onClick={onDelete}
    >
      Confirm Delete
    </Button>
    <Button
      secondary
      onClick={onCancel}
    >
      Cancel
    </Button>
  </div>
</div>
