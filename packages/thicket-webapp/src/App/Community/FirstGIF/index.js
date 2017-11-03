import React from 'react'
import { Button } from 'thicket-elements'
import Close from '../../../components/Close'
import './FirstGIF.css'

const FirstGIF = props => <div className="firstgif">
  <div className="firstgif__wrap">
    <div className="firstgif__close">
      <Close onClick={props.onClose} />
    </div>
    <div className="firstgif__modal">
      <header className="firstgif__header">
        <h3>Welcome to Thicket Communities</h3>
      </header>
      <main className="firstgif__main">
        Awesome, you shot your first GIF! We automatically added it to a new Community called “SamSmall44 & Friends”.
        Update your community title if you’d like:
        <form></form>
        Or copy the Community Invite Link below and share with friends so they can create and add content:
        <input type="text" value="FIJO" />
        NOTE: Anyone with this link can join and contribute content. Only send to reliable users and do not post publically.
      </main>
      <footer className="firstgif__footer">
        <Button onClick={props.onClose}>Close</Button>
      </footer>
    </div>
  </div>
</div>

export default FirstGIF
