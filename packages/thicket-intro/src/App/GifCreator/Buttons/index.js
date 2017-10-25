import React from 'react'
import './Buttons.css'

export const Button = ({ children }) => (
  <button className="Button">{children}</button>
)

export const DisabledButton = ({ children, tip }) => (
  <button className="Button Button--disabled" disabled data-tip={tip}>
    {children}
  </button>
)
