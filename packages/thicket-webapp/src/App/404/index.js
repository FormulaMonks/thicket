import React from 'react'
import notFoundSvg from './404.svg'
import { Button } from 'thicket-elements'
import './404.css'

export default ({ history }) =>
  <div
    data-test="not-found"
    className="notFound"
  >
    <img src={notFoundSvg} alt="Not Found Error Code" />
    <h2>Oops, you got lost or something went wrong.</h2>
    <div className="notFound__msg">The page you’re looking for isn’t available. Try checking the original link or go to Thicket Home using the button below.</div>
    <Button onClick={() => history.replace('/communities')}>Thicket Home</Button>
  </div>
