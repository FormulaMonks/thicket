import React from 'react'
import styled from 'styled-components'

const glow = '0px 14px 65px rgba(210, 102, 160, 0.7), 0px 4px 14px rgba(16, 33, 49, 0.6), 0px 8px 14px rgba(39, 64, 88, 0.4)'

const Background = styled.div`
  /* mobile
   * encapsulating div with padding
   * */
  padding: 1.375em;

  /* desktop
   * full sized transparent background
   * */
  @media (min-width: 600px) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(16,33,49,0.9);
    padding: 0;
  }
`

const Wrap = styled.div`
  /* mobile
   * */
  width: 100%;
  background: #F6F9FD;
  box-shadow: ${glow};
  border-radius: 4px;
  overflow: hidden;

  /* desktop
   * white background container
   * */
  @media (min-width: 600px){
    height: 60%;
    width: 50%;
  }
`

const Modal = ({ children, ...props }) => <Background>
  <Wrap {...props}>
    {children}
  </Wrap>
</Background>

export default Modal
