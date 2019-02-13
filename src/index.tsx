import React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './Repositories';
import { initializeIcons } from '@uifabric/icons';

initializeIcons();
ReactDOM.render((<App />), document.getElementById('root'));