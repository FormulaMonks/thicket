import React from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  background-color: rgba(255, 255, 255, 0.4);
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

const Title = styled.p`
  font-size: 2em;
`

const ShootBtn = styled.button`
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
    top: -36px;
    left: -36px;
    border: 6px solid rgba(0, 0, 0,.5);
    padding: 36px;
    border-radius: 50%;
    content: ''
  }

  &: before{
    position: absolute;
    top: -24px;
    left: -24px;
    border: 6px solid rgba(0, 0, 0, .3);
    padding: 24px;
    border-radius: 50%;
    content: ''
  }
`

const Controls = props => {
  const { controlsWrap, controlsTitle, controlsButton } = props.classNames
  return <Wrap className={controlsWrap}>
    <Title className={controlsTitle}>Create a GIF!</Title>
    <ShootBtn className={controlsButton} onClick={props.onClick}>Shoot</ShootBtn>
  </Wrap>
}

export default Controls
