import React from 'react';
import * as ReactDOM from 'react-dom';
import { initializeIcons } from '@uifabric/icons';
import Repositories from './Repositories';
import Releases from './Releases';
import Overview from './Overview';
import { AzDoService, DummyAzDoService, IAzDoService } from './services/AzDoService'
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
import { loadTheme } from '@uifabric/styling';
import * as SDK from "azure-devops-extension-sdk";

import './index.css';
import Builds from './Builds';
loadTheme({}); // <- This is a very important line
initializeIcons();

if(process.env.NODE_ENV !== "production")
{
    let azDoService: IAzDoService = new DummyAzDoService(); 
    let element: JSX.Element = GetRootElement(azDoService);
    ReactDOM.render(<Fabric>{element}</Fabric>, document.getElementById('root'));
} else {
    SDK.init();

    SDK.ready().then(() => {
        let azDoService: IAzDoService = new AzDoService(); 
        let element: JSX.Element = GetRootElement(azDoService);
        
        ReactDOM.render(<Fabric>{element}</Fabric>, document.getElementById('root'));
        SDK.notifyLoadSucceeded();
    });
}

function GetRootElement(azDoService: IAzDoService) {
    // Not using react router because the paths are incompatible
    // with static hosting on Azure Devops extensions therefore
    // using index.html#report as identifier.
    let element: JSX.Element;
    const report = window.location.hash.substr(1);
    switch (report) {
        case 'builds':
            element = (<Builds azDoService={azDoService} />);
            break;
        case 'repositories':
            element = (<Repositories azDoService={azDoService} />);
            break;
        case 'releases':
            element = (<Releases azDoService={azDoService} />);
            break;
        case 'overview':
            element = (<Overview azDoService={azDoService} />);
            break;
        default:
            element = (<span className="error">No report specified.</span>);
    }
    return element;
}

