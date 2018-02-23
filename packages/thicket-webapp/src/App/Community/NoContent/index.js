import React from 'react'
import sadSvg from '../../../images/sad.svg'
import { Spinner, Button } from 'thicket-elements'
import './NoContent.css'

export default ({ onCreate, syncing }) => {
  if (syncing) {
    return <div className="communityNoContent">
      <Spinner />
      <h2>Syncing Community</h2>
      <div>Your community is syncing data between the browsers currently online. This may take a moment.</div>
    </div>
  }

  return <div className="communityNoContent">
    <img src={sadSvg} alt="Sad because there are no GIFs" />
    <h2>This Community doesn’t have content yet!</h2>
    <div className="communityNoContent__text">Create new GIFs to add to the Community or invite new or existing Thicket users to create and contribute GIFs.</div>
    <Button onClick={onCreate}>Create GIF</Button>
  </div>
}
