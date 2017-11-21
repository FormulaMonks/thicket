import React from 'react'
import './Buttons.css'

export const Button = ({ component = 'button', children, color, ...props }) => (
  React.createElement(
    component,
    { className: 'Button', 'data-color': color, ...props },
    children
  )
)

export const DisabledButton = ({ children, tip }) => (
  <button className="Button Button--disabled" disabled data-tip={tip}>
    {children}
  </button>
)
