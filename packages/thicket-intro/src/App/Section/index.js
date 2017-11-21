import React from 'react'

import './Section.css'

export default ({ children, id, style }) => (
  <section className="Section--wrap" id={id} style={style}>
    <div className="Section--inner">
      {children}
    </div>
  </section>
)
