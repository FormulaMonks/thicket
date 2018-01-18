import React from 'react'

import Button from './Button'
import Spinner from './Spinner'
import Input from './Input'
import * as Styles from './sharedStyles'
import CommunityCard from './CommunityCard'
import Modal from './Modal'
import Icon from './Icon'
import * as Icons from './Icons'
import ShareLink, { Trigger as ShareTrigger } from './ShareLink'

const shareLinkExample = `render() &#123;
  const sharing = this.state.sharing;
  return (
    &lt;ShareTrigger active={sharing}&gt;
      &lt;Button onClick=&#123;() =&gt; this.setState(&#123;sharing: !sharing&#125;)&#125;&gt;
        Share
      &lt;/Button&gt;
    &lt;/ShareTrigger&gt;
    &#123;sharing &amp;&amp;
      &lt;ShareLink onBlur=&#123;() =&gt; this.setState(&#123; sharing: false&#125;)&#125;/&gt;
    &#125;
  )
&#125;
`

export default class Example extends React.Component {
  state = { sharing: false }

  render() {
    const { sharing } = this.state
    return (
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
            <div style={{ maxWidth: 950 }}>
              <h3>What is Lorem Ipsum?</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Placerat in egestas erat imperdiet sed. In nibh mauris cursus mattis. Convallis convallis tellus id interdum velit laoreet. Neque viverra justo nec ultrices. Egestas pretium aenean pharetra magna ac. At tempor commodo ullamcorper a lacus vestibulum sed. Scelerisque purus semper eget duis at. Id ornare arcu odio ut. Donec massa sapien faucibus et molestie ac feugiat sed. Massa id neque aliquam vestibulum morbi blandit cursus risus.</p>
              <p>Tempus iaculis urna id volutpat lacus laoreet. Malesuada bibendum arcu vitae elementum curabitur. Amet risus nullam eget felis eget. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Ac auctor augue mauris augue neque. Et egestas quis ipsum suspendisse. Cras tincidunt lobortis feugiat vivamus at. Aenean vel elit scelerisque mauris pellentesque pulvinar. Id diam vel quam elementum pulvinar etiam non. Sagittis purus sit amet volutpat. Suspendisse faucibus interdum posuere lorem ipsum dolor sit. Amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus. Purus sit amet luctus venenatis. Lobortis scelerisque fermentum dui faucibus in. Enim nec dui nunc mattis enim. Senectus et netus et malesuada fames ac turpis. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi tristique senectus. Lectus nulla at volutpat diam ut venenatis tellus.</p>
            </div>
          </Modal>
        </div>
        <h2>ShareLink</h2>
        <p>
          Only render <code>ShareLink</code> when you need it to be open.
          Handle your own open/closed state yourself.
        </p>
        <p>
          You will need to <code>import ShareLink, &#123; Trigger &#125;</code>. The
          {' '}<code>Trigger</code> you can use to wrap whatever element you want to
          open the <code>ShareLink</code>, in order to style it properly with
          the dropdown arrow. Example:
        </p>
        <pre dangerouslySetInnerHTML={{__html: shareLinkExample}} />
        <ShareTrigger active={sharing}>
          <Button onClick={() => this.setState({sharing: !sharing})}>
            Share
          </Button>
        </ShareTrigger>
        {sharing && <ShareLink onBlur={() => this.setState({ sharing: false})} />}
        <h2>Icons</h2>
        <Icon src={Icons.downloadSvg} size="50" />
        <Icon src={Icons.shareSvg} size="50" />
        <Icon src={Icons.facebookSvg} size="50" />
        <Icon src={Icons.twitterSvg} size="50" />
        <Icon src={Icons.addSvg} size="50" iconSize="30" />
      </div>
    )
  }
}

export {
  Spinner,
  Button,
  Input,
  Styles,
  CommunityCard,
  Modal,
  Icons,
  Icon,
  ShareLink,
}
