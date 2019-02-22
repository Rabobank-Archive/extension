import React from 'react';
import * as ReactDOM from 'react-dom';
import { initializeIcons } from '@uifabric/icons';
import Repositories from './Repositories';
import Releases from './Releases';

import './index.css';
initializeIcons();

// Not using react router because the paths are incompatible
// with static hosting on Azure Devops extensions therefore
// using index.html#report as identifier.
let element: JSX.Element;
const report = window.location.hash.substr(1);
switch (report) {
    case 'repositories':
        element = (<Repositories />);
        break;
    case 'releases':
        element = (<Releases />);
        break;
    default:
        element = (<span className="error">No report specified.</span>)
}

ReactDOM.render(element, document.getElementById('root'));