import React, { Component } from 'react'
import styled from 'styled-components'
import favorite from '../../images/favorite.svg'
import placeholder from '../../images/placeholder.png'
import {
  linearGradient,
  hoverLinearGradient,
  defaultBoxShadow,
} from '../sharedStyles'

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  background: ${linearGradient};
  box-shadow: ${defaultBoxShadow};
  display: inline-block;
  border-radius: 4px;
  padding: 2px;
  cursor: pointer;

  &:hover .communityCard__hover{
    background: linear-gradient(246.41deg, rgba(247, 97, 139, 0.3) -9.23%, rgba(42, 122, 255, 0.3) 118.44%);
  }
  &:hover .communityCard__meta{
      background: ${linearGradient};
  }
  &:hover .communityCard__meta,
  &:hover .communityCard__extra{
      color: #FFF;
  }
`

const Card = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  border-radius: 4px;
`

const Img = styled.img`
  align-self: flex-start;
  display: block;
  width: 100%;
`

const Leave = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 2;
  border: none;
  background: unset;
  cursor: pointer;
  padding: 0;
  margin: 0;
`

const Favorite = styled.img`
  display: block;
  height: 42px;
  width: 42px;
`

const Meta = styled.div`
  width: 100%;
  height: 100%;
  background: #F6F9FD;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #46569F;
  padding: 1em;
  margin-top: 2px;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 2;
`

const Title = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0.5em 0;
  font-weight: bold;
`

const Extra = styled.div`
  color: #677897;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8em;
`

const CreatedBy = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 70%;
`

const Hover = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
`

class CommunityCard extends Component {
  render() {
    const {
    title = '',
    createdBy = '',
    src = favorite,
    usage = '',
    onLeave=()=>{},
    ...rest
    } = this.props
  return <Wrap {...rest}>
      <Card>
        <Leave
          data-test="communities-leave"
          className="communities__leave"
          onClick={e => onLeave(e, title)}
        >
          <Favorite src={src} alt="Leave Community" />
        </Leave>
        <Img src={placeholder} alt={title} />
        <Meta className="communityCard__meta">
          <Title>{title}</Title>
          <Extra className="communityCard__extra">
            <CreatedBy>{createdBy}</CreatedBy>
            <div>{usage}</div>
          </Extra>
        </Meta>
        <Hover className="communityCard__hover" />
      </Card>
    </Wrap>
  }
}

export default CommunityCard
