import React, {Component} from 'react'

import Button from './Button'
import Spinner from './Spinner'
import Input from './Input'
import * as Styles from './sharedStyles'
import CommunityCard from './CommunityCard'
import Modal from './Modal'

export default () => (
  <div>
    <h2>Spinner</h2>
    <Spinner />
    <h2>Button</h2>
    <Button onClick={() => console.log('button!')}>Click Me</Button>
    <h2>Secondary Button</h2>
    <Button secondary onClick={() => console.log('button!')}>Click Me</Button>
    <p>
      <small>
        <code>SecondaryButton</code> needs a global <code>* &#123; background-color: inherit &#125;</code> to work properly
      </small>
    </p>
    <h2>Text Input</h2>
    <Input placeholder="Text Input" />
    <h2>Community Card</h2>
    <div style={{ height: 300, width: 300 }}>
      <CommunityCard title="Community Title" createdBy="Nickname" usage="disk space" />
    </div>
    <h2>Modal</h2>
    <div style={{ color: '#000', height: 600, width: '100%', background: '#FFF', overflow: 'auto', boxSizing: 'border-box', border: '2px dashed #000', position: 'relative' }}>
      <Modal>
        <h3>What is Lorem Ipsum?</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat in egestas erat imperdiet sed. In nibh mauris cursus mattis. Convallis convallis tellus id interdum velit laoreet. Neque viverra justo nec ultrices. Egestas pretium aenean pharetra magna ac. At tempor commodo ullamcorper a lacus vestibulum sed. Scelerisque purus semper eget duis at. Id ornare arcu odio ut. Donec massa sapien faucibus et molestie ac feugiat sed. Massa id neque aliquam vestibulum morbi blandit cursus risus.</p>
        <p>Tempus iaculis urna id volutpat lacus laoreet. Malesuada bibendum arcu vitae elementum curabitur. Amet risus nullam eget felis eget. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Ac auctor augue mauris augue neque. Et egestas quis ipsum suspendisse. Cras tincidunt lobortis feugiat vivamus at. Aenean vel elit scelerisque mauris pellentesque pulvinar. Id diam vel quam elementum pulvinar etiam non. Sagittis purus sit amet volutpat. Suspendisse faucibus interdum posuere lorem ipsum dolor sit. Amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus. Purus sit amet luctus venenatis. Lobortis scelerisque fermentum dui faucibus in. Enim nec dui nunc mattis enim. Senectus et netus et malesuada fames ac turpis. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Lectus nulla at volutpat diam ut venenatis tellus.</p>
      </Modal>
    </div>
    <h2>Modal</h2>
    <div style={{ height: 600, width: '100%', background: '#FFF', overflow: 'auto', boxSizing: 'border-box', border: '2px dashed #000', position: 'relative' }}>
      <Modal>
        <h3>What is Lorem Ipsum?</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat in egestas erat imperdiet sed. In nibh mauris cursus mattis. Convallis convallis tellus id interdum velit laoreet. Neque viverra justo nec ultrices. Egestas pretium aenean pharetra magna ac. At tempor commodo ullamcorper a lacus vestibulum sed. Scelerisque purus semper eget duis at. Id ornare arcu odio ut. Donec massa sapien faucibus et molestie ac feugiat sed. Massa id neque aliquam vestibulum morbi blandit cursus risus.</p>
        <p>Tempus iaculis urna id volutpat lacus laoreet. Malesuada bibendum arcu vitae elementum curabitur. Amet risus nullam eget felis eget. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Ac auctor augue mauris augue neque. Et egestas quis ipsum suspendisse. Cras tincidunt lobortis feugiat vivamus at. Aenean vel elit scelerisque mauris pellentesque pulvinar. Id diam vel quam elementum pulvinar etiam non. Sagittis purus sit amet volutpat. Suspendisse faucibus interdum posuere lorem ipsum dolor sit. Amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus. Purus sit amet luctus venenatis. Lobortis scelerisque fermentum dui faucibus in. Enim nec dui nunc mattis enim. Senectus et netus et malesuada fames ac turpis. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Lectus nulla at volutpat diam ut venenatis tellus.</p>
      </Modal>
    </div>
  </div>
)

export {
  Spinner,
  Button,
  Input,
  Styles,
  CommunityCard,
  Modal,
}
