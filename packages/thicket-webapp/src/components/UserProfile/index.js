import React from 'react'
import UserName from '../../components/UserName'
import editSvg from './edit.svg'
import './UserProfile.css'

export default ({ nickname }) => (
  <div className="userProfile">
    <UserName str={nickname} /> <img src={editSvg} alt="Edit profile" />
  </div>
)
