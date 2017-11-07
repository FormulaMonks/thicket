import React from 'react'
import './Square.css'

export default ({ background }) => (
  <div className="Square outer">
    <div className="Square inner" style={{ backgroundImage: `url(${background})` }} />
  </div>
)
