import React from 'react'
import { Icon, Icons } from 'thicket-elements'
import './AddButton.css'

const { addSvg } = Icons

export default ({ onClick, className }) => {
  return <button
    className={`addbutton${className ? ' ' + className : ''}`}
    onClick={onClick}
  >
    <Icon src={addSvg} bgColor="inherit" />
  </button>
}
