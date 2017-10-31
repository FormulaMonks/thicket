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
  font-size: 40px;
  text-shadow: 1px 1px 10px #FFF;
`
const Button = styled.button`
  color: rgba(0,0,0,0);
  cursor: pointer;
  background: rgba(255,255,255,0.6);
  border: 10px solid #333;
  border-radius: 20px;
  box-shadow: 0 0 20px #FFF;
  position: relative;
  &: after{
    color: red;
    position: absolute;
    top: -37px;
    left: -37px;
    border: 5px solid rgba(119,119,119,.5);
    padding: 40px;
    border-radius: 60px;
    box-shadow: 0 0 20px #FFF;
    display: block;
    content: ''
  }
  &: before{
    color: blue;
    position: absolute;
    top: -24px;
    left: -24px;
    border: 7px solid rgba(119, 119, 119, .3);
    padding: 25px;
    border-radius: 50px;
    box-shadow: 0 0 20px #FFF;
    display: block;
    content: ''
  }
`

const Controls = props => <Wrap>
  <H2>Create a GIF</H2>
  <Button onClick={props.onClick}>·</Button>
</Wrap>

export default Controls
