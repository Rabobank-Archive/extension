import React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import { initializeIcons } from '@uifabric/icons';
import Repositories from './Repositories';
import Releases from './Releases';

initializeIcons();

const route = window.location.hash.substr(1);
let element: JSX.Element = (<span />)
if (route === 'repositories') {
    element = (<Repositories />);
} else if (route === 'releases') {
    element = (<Releases />);
}

ReactDOM.render(element, document.getElementById('root'));