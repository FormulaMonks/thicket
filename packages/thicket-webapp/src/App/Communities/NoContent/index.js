import React from 'react'
import { Button } from 'thicket-elements'
import sadSvg from './sad.svg'
import './NoContent.css'

export default ({ onCreate }) => {
  return <div className="noContent">
    <img src={sadSvg} alt="Sad because there are no communities" />
    <h3>You don’t have any Communities.</h3>
    <div className="noContent__text">You left all of your shared and created Communities. Ask an existing Thicket user for an invite to a Community or create a new one.</div>
    <Button onClick={onCreate}>Create Community</Button>
  </div>
}
