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
import BuildPipelines from './BuildPipelines';

let azDoService: IAzDoService;

if(process.env.REACT_APP_USE_AZDO_SERVICE == "true") {
    azDoService = new AzDoService();
} else {
    azDoService = new DummyAzDoService(); 
}

if(process.env.REACT_APP_USE_AZDO_SDK == "true")
{
    SDK.init();
    SDK.ready().then(() => {
        let element: JSX.Element = GetRootElement(azDoService);
        ReactDOM.render(element, document.getElementById('root'));
        SDK.notifyLoadSucceeded();
    });
} else {
    let element: JSX.Element = GetRootElement(azDoService);
    ReactDOM.render(element, document.getElementById('root'));
}

function GetRootElement(azDoService: IAzDoService) {
    // Not using react router because the paths are incompatible
    // with static hosting on Azure Devops extensions therefore
    // using index.html#report as identifier.
    let element: JSX.Element;
    const report = window.location.hash.substr(1);
    switch (report) {
        case 'build-pipelines':
            element = (<BuildPipelines azDoService={azDoService} />)
            break;
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

