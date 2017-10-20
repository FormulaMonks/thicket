import React from 'react'
import { Link } from 'react-router-dom'
import leftArrowPng from './left-arrow.png'
import './Back.css'

export default ({ to, alt }) => <Link to={to}>
    <img alt={alt} src={leftArrowPng} className="back__img" />
  </Link>
