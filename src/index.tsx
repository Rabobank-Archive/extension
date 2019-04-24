import React from 'react';
import * as ReactDOM from 'react-dom';
import Repositories from './Repositories';
import Releases from './Releases';
import Overview from './Overview';
import Builds from './Builds';

import { IAzDoService } from './services/IAzDoService'
import { AzDoService } from "./services/AzDoService";
import { DummyAzDoService } from "./services/DummyAzDoService";

import * as SDK from "azure-devops-extension-sdk";
import { Page } from "azure-devops-ui/Page"

if(process.env.NODE_ENV !== "production")
{
    let azDoService: IAzDoService = new DummyAzDoService(); 
    let element: JSX.Element = GetRootElement(azDoService);
    ReactDOM.render(element, document.getElementById('root'));
} else {
    SDK.init();

    SDK.ready().then(() => {
        let azDoService: IAzDoService = new AzDoService(); 
        let element: JSX.Element = GetRootElement(azDoService);
        
        ReactDOM.render(<Page>{element}</Page>, document.getElementById('root'));
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
            element = (<Page><Builds azDoService={azDoService} /></Page>);
            break;
        case 'repositories':
            element = (<Page><Repositories azDoService={azDoService} /></Page>);
            break;
        case 'releases':
            element = (<Page><Releases azDoService={azDoService} /></Page>);
            break;
        case 'overview':
            element = (<Overview azDoService={azDoService} />);
            break;
        default:
            element = (<span className="error">No report specified.</span>);
    }
    return element;
}

