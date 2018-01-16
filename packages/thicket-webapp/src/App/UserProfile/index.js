import React from 'react'
import randomColor from 'randomcolor'
import editSvg from './edit.svg'
import './UserProfile.css'

export default ({ nickname }) => (
  <div className="userProfile">
    <span
      className="userProfile__initial"
      style={{
        background: randomColor({ seed: nickname, luminosity: 'dark' }),
      }}
    >
      {nickname.substr(0, 1)}
    </span>{' '}
    {nickname} <img src={editSvg} alt="Edit profile" />
  </div>
)
