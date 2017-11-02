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
  color: #333;
`
const H2 = styled.h2`
  text-shadow: 1px 1px 10px #FFF;
`
const Button = styled.button`
  text-indent: -9999em;
  height: 32px;
  color: rgba(0,0,0,0);
  cursor: pointer;
  background: rgba(255,255,255,0.6);
  border: 10px solid #333;
  border-radius: 50%;
  box-shadow: 0 0 20px #FFF;
  position: relative;
  /* half of the added paddigs */
  margin-top: 14px;
  
  &: after{
    position: absolute;
    top: -300%;
    left: -300%;
    border: 6px solid rgba(119,119,119,.5);
    padding: 36px;
    border-radius: 50%;
    box-shadow: 0 0 20px #FFF;
    content: ''
  }
  
  &: before{
    position: absolute;
    top: -200%;
    left: -200%;
    border: 6px solid rgba(119, 119, 119, .3);
    padding: 24px;
    border-radius: 50%;
    box-shadow: 0 0 20px #FFF;
    content: ''
  }
`

const Controls = props => <Wrap>
  <H2>Create a GIF</H2>
  <Button onClick={props.onClick}>Shoot</Button>
</Wrap>

export default Controls
