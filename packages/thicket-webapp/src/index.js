import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Mapper from './Mapper';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Mapper />, document.getElementById('root'));
registerServiceWorker();
