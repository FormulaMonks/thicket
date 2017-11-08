import React from 'react';
import logo from './logo.svg'
import dribbble from './dribbble.svg'
import facebook from './facebook.svg'
import github from './github.svg'
import linkedin from './linkedin.svg'
import twitter from './twitter.svg'
import './Footer.css';

export default class Footer extends React.Component {
  render() {
    return (
      <footer className="Footer">
        <div className="Footer--columns">
          <div>
            <a className="Footer--logoLink" href="https://citrusbyte.com/">
              <img className="Footer--logo" alt="Citrusbyte" src={logo} />
              <p><strong>Build Better</strong>&trade;</p>
            </a>
          </div>

          <div>
            <strong>Company</strong>
            <ul className="Footer--linkList">
              <li><a href="https://citrusbyte.com/portfolio">Work</a></li>
              <li><a href="https://citrusbyte.com/our-approach">What We Do</a></li>
              <li><a href="https://citrusbyte.com/about-us">Who We Are</a></li>
              <li><a href="https://citrusbyte.com/contact-us">Contact</a></li>
            </ul>
            <ul className="Footer--linkList">
              <li><a href="https://citrusbyte.com/careers">Careers</a></li>
              <li><a href="https://citrusbyte.com/training">Training</a></li>
              <li><a href="https://citrusbyte.com/enterprise-modernization">Enterprise Modernization</a></li>
              <li><a href="http://citrusven.com/" target="_blank" rel="noopener noreferrer">Citrus Ventures</a></li>
            </ul>
          </div>

          <div>
            <strong>Products</strong>
            <ul className="Footer--linkList">
              <li><a href="http://www.overwatchsec.com/" target="_blank" rel="noopener noreferrer">Overwatch</a></li>
              <li><a href="http://apimissioncontrol.com/" target="_blank" rel="noopener noreferrer">Mission Control</a></li>
              <li><a href="http://www.getcontour.co/" target="_blank" rel="noopener noreferrer">Contour</a></li>
            </ul>
          </div>

          <div>
            <strong>We’re also on</strong>
            <ul className="Footer--linkList Footer--socialList">
              <li><a className="Footer--socialIcon"
                href="https://github.com/citrusbyte"
                target="_blank" rel="noopener noreferrer">
                <img alt="Connect on Github" src={github} />
              </a></li>

              <li><a className="Footer--socialIcon"
                href="https://dribbble.com/citrusbyte"
                target="_blank" rel="noopener noreferrer">
                <img alt="Connect on Dribbble" src={dribbble} />
              </a></li>

              <li><a className="Footer--socialIcon"
                href="https://www.facebook.com/citrusbyte"
                target="_blank" rel="noopener noreferrer">
                <img alt="Connect on Facebook" src={facebook} />
              </a></li>

              <li><a className="Footer--socialIcon"
                href="https://twitter.com/citrusbyte"
                target="_blank" rel="noopener noreferrer">
                <img alt="Connect on Twitter" src={twitter} />
              </a></li>

              <li><a className="Footer--socialIcon"
                href="https://www.linkedin.com/company/citrusbyte"
                target="_blank" rel="noopener noreferrer">
                <img alt="Connect on LinkedIn" src={linkedin} />
              </a></li>
            </ul>
          </div>
        </div>
        <p className="Footer--copyright">Copyright © 2007-{(new Date()).getFullYear()} Citrusbyte, LLC. All Rights Reserved. <a href="https://citrusbyte.com/privacy-policy">Privacy Policy</a></p>
      </footer>
    );
  }
}
