import React from 'react'
import styled from 'styled-components'
import {
  linearGradient,
  defaultBoxShadow,
  hoverBoxShadow,
  activeBoxShadow,
} from '../sharedStyles'

const Button = styled.button`
  box-shadow: ${defaultBoxShadow};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  outline: none;

  &:focus, &:hover {
    box-shadow: ${hoverBoxShadow};
  }

  &:active {
    box-shadow: ${activeBoxShadow}
  }
`

const PrimaryButton = styled(Button)`
  background: ${linearGradient};
  color: white;
  padding: 1em 3em;
`

const SecondaryButton = styled(Button)`
  background-color: inherit;
  color: inherit;
  padding: calc(1em - 1px) calc(3em - 1px);

  &:focus, &:hover, &:active {
    background: ${linearGradient};
    color: white;
  }
`

const SecondaryWrap = styled.div`
  background-color: inherit;
  background-image: ${linearGradient};
  padding: 1px;
  border-radius: 4px;
  display: inline-block;
`

export default props => {
  const { children, secondary, ...rest } = props
  if (secondary) {
    return <SecondaryWrap>
      <SecondaryButton {...rest}>{children}</SecondaryButton>
    </SecondaryWrap>
  }
  return <PrimaryButton {...rest}>{children}</PrimaryButton>
}
