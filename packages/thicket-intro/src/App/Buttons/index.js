import React from 'react'
import './Buttons.css'

export const Button = ({ component = 'button', children, ...props }) => (
  React.createElement(
    component,
    { className: 'Button', ...props },
    children
  )
)

export const DisabledButton = ({ children, tip }) => (
  <button className="Button Button--disabled" disabled data-tip={tip}>
    {children}
  </button>
)
