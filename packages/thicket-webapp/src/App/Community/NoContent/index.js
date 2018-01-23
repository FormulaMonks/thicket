import React from 'react'
import sadSvg from '../../../images/sad.svg'
import { Button } from 'thicket-elements'
import './NoContent.css'

export default ({ onCreate }) => <div className="noContent">
  <img src={sadSvg} alt="Sad because there are no GIFs" />
  <h3>This Community doesn’t have content yet!</h3>
  <div className="noContent__text">Create new GIFs to add to the Community or invite new or existing Thicket users to create and contribute GIFs.</div>
  <Button onClick={onCreate}>Create New GIF</Button>
</div>
