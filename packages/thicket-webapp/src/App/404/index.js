import React from 'react'
import notFoundSvg from './404.svg'
import { Button } from 'thicket-elements'
import store from '../../database/store'
import './404.css'

const { communities } = store

const redirect = async history => {
  const userCommunities = await communities.getAll()
  const whereTo = !userCommunities.length ? '/welcome' : '/communities'
  history.replace(whereTo)
}

export default ({ history }) => <div className="notFound">
  <img src={notFoundSvg} alt="Not Found Error Code" />
  <h3>Oops, you got lost or something went wrong.</h3>
  <div className="notFound__msg">The page you’re looking for isn’t available. Try checking the original link or go to Thicket Home using the button below.</div>
  <Button onClick={() => redirect(history)}>Thicket Home</Button>
</div>
