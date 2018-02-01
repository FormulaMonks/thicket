import React from 'react'
import sadSvg from '../../../images/sad.svg'
import { Spinner, Button } from 'thicket-elements'
import './NoContent.css'

export default ({ onCreate, syncing }) => {
  if (syncing) {
    return <div className="noContent">
      <Spinner className="noContent__spinner" />
      <h3>Syncing Community</h3>
      <div>Your community is syncing data between the browsers currently online. This may take a moment.</div>
    </div>
  }

  return <div className="noContent">
    <img src={sadSvg} alt="Sad because there are no GIFs" />
    <h3>This Community doesn’t have content yet!</h3>
    <div>Create new GIFs to add to the Community or invite new or existing Thicket users to create and contribute GIFs.</div>
    <Button onClick={onCreate}>Create New GIF</Button>
  </div>
}
