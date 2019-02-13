import React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import { initializeIcons } from '@uifabric/icons';
import Repositories from './Repositories';
import Releases from './Releases';
const VSS = require('vss-web-extension-sdk/lib/VSS.SDK');

initializeIcons();

// only do VSS stuff when running as part of the extension
if (typeof VSS != 'undefined') {
    VSS.init({
        setupModuleLoader: true,
        explicitNotifyLoaded: false,
        usePlatformScripts: true,
        usePlatformStyles: true
    });
}

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