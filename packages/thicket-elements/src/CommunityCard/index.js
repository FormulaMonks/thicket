import React from 'react'
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
  padding: 1px;
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
  background-image: url(${placeholder});
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: flex-end;
  border-radius: 4px;
`

const Favorite = styled.img`
  position: absolute;
  top: 5px;
  right: 5px;
  height: 2.5em;
  width: 2.5em;
  z-index: 2;
`

const Meta = styled.div`
  width: 100%;
  background: #FFF;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #46569F;
  padding: 1rem;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  z-index: 2;
`

const Extra = styled.div`
  color: #677897;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

const Hover = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 1;
`

const CommunityCard = ({
  title = '',
  createdBy = '',
  src = favorite,
  usage = '',
  ...rest
}) => <Wrap>
  <Card {...rest}>
    <Favorite src={src} alt="" />
    <Meta className="communityCard__meta">
      <div>{title}</div>
      <Extra className="communityCard__extra">
        <div>{createdBy}</div>
        <small>{usage}</small>
      </Extra>
    </Meta>
    <Hover className="communityCard__hover" />
  </Card>
</Wrap>

export default CommunityCard
