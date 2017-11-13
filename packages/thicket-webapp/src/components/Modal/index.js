import React from 'react'
import Close from '../Close'
import './Modal.css'

const Modal = ({ header, children, footer, onClose }) => <div className="modal">
  <div className="modal__wrap">
    <div className="modal__close">
      <Close onClick={onClose} />
    </div>
    <div className="modal__inner">
      {header}
      <main className="modal__main">
        {children}
      </main>
      {footer}
    </div>
  </div>
</div>

export default Modal
