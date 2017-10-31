import React, { Component } from 'react'
import styled from 'styled-components'

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`
const H2 = styled.h2`
  color: #333;
`
const Preview = styled.div`
  flex: 1;
  display: flex;
  widht: 100%;
`
const Img = styled.img`
  width: 50%;
  object-fit: cover;
  background: #777;
`
const Inputs = styled.div`
  width: 50%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Label = styled.label`
  margin: 10px 0;
  max-width: 100%;
  color: #777;
  font-weight: bold;
`
const Span = styled.span`
  font-weight: normal;
`
const Input = styled.input`
  box-sizing: border-box;
  margin: 10px 0;
  padding: 15px;
  color: #777;
  width: 100%;
`
const Controls = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
`
const Button = styled.button`
  cursor: pointer;
  border: 1px solid #777;
  padding: 20px;
  background: transparent;
  color: #777;
  &:hover{
    background: #777;
    color: #FFF;
  }
`
const Submit = Button.extend`
  width: 150px;
`

const randomNickname = `Guest${Math.floor((Math.random * 1000) + 1)}`

class Customize extends Component {

  constructor(props) {
    super(props)
    this.state = {
      caption: '',
      nickname: props.nickname || randomNickname
    }
  }

  render() {
    return <Wrap>
      <H2 key="title">Save your GIF</H2>
      <Preview key="preview">
        <Img src={this.props.src} />
        <Inputs>
          <Label>
            Use a different nickname? <Span>(Optional)</Span>
            <Input type="text" value={this.state.nickname} onChange={e => this.setState({ nickname: e.target.value })} />
          </Label>
          <Label>
            Give your GIF a caption:
            <Input type="text" value={this.state.caption} onChange={e => this.setState({ caption: e.target.value })} />
          </Label>
        </Inputs>
      </Preview>
      <Controls key="controls">
        <Button onClick={this.props.onCancel}>Cancel</Button>
        <Submit onClick={this.onSubmit}>Submit</Submit>
      </Controls>
    </Wrap>
  }

  onSubmit = () => {
    this.props.onSubmit({ src: this.props.gif, caption: this.state.caption, nickname: this.state.nickname })
  }
}

export default Customize
