import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  position: absolute;
  z-index: 1;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`
const Button = styled.button`
  text-indent: -9999em;
  height: 32px;
  cursor: pointer;
  border: 10px solid rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  position: relative;
  /* half of the added paddings */
  margin-top: 14px;

  &: after{
    position: absolute;
    top: -300%;
    left: -300%;
    border: 6px solid rgba(0, 0, 0,.5);
    padding: 36px;
    border-radius: 50%;
    content: ''
  }

  &: before{
    position: absolute;
    top: -200%;
    left: -200%;
    border: 6px solid rgba(0, 0, 0, .3);
    padding: 24px;
    border-radius: 50%;
    content: ''
  }
`

const Controls = props => {
  const { controlsWrap, controlsTitle, controlsButton } = props.classNames
  return <Wrap className={controlsWrap}>
    <h2 className={controlsTitle}>Create a GIF</h2>
    <Button className={controlsButton} onClick={props.onClick}>Shoot</Button>
  </Wrap>
}

export default Controls
