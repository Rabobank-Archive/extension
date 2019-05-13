import React from 'react';
import * as ReactDOM from 'react-dom';
import Repositories from './Repositories';
import Releases from './Releases';
import Overview from './Overview';
import Builds from './Builds';
import BuildPipelines from './BuildPipelines';
import ReleasePipelines from './ReleasePipelines';

import { IAzDoService } from './services/IAzDoService'
import { AzDoService } from "./services/AzDoService";
import { DummyAzDoService } from "./services/DummyAzDoService";

import { ICompliancyCheckerService } from './services/ICompliancyCheckerService'
import { CompliancyCheckerService } from './services/CompliancyCheckerService';
import { DummyCompliancyCheckerService } from './services/DummyCompliancyCheckerService';

import * as SDK from "azure-devops-extension-sdk";

let azDoService: IAzDoService;
let compliancyCheckerService: ICompliancyCheckerService;

if(process.env.REACT_APP_USE_AZDO_SERVICE === "true") {
    azDoService = new AzDoService();
} else {
    azDoService = new DummyAzDoService(); 
}

if(process.env.REACT_APP_USE_COMPLIANCYCHECKER_SERVICE === "true") {
    compliancyCheckerService = new CompliancyCheckerService(azDoService);
} else {
    compliancyCheckerService = new DummyCompliancyCheckerService(azDoService);
}

if(process.env.REACT_APP_USE_AZDO_SDK === "true")
{
    SDK.init();
    SDK.ready().then(() => {
        let element: JSX.Element = GetRootElement(azDoService, compliancyCheckerService);
        ReactDOM.render(element, document.getElementById('root'));
        SDK.notifyLoadSucceeded();
    });
} else {
    let element: JSX.Element = GetRootElement(azDoService, compliancyCheckerService);
    ReactDOM.render(element, document.getElementById('root'));
}

function GetRootElement(azDoService: IAzDoService, compliancyCheckerService: ICompliancyCheckerService) {
    // Not using react router because the paths are incompatible
    // with static hosting on Azure Devops extensions therefore
    // using index.html#report as identifier.
    let element: JSX.Element;
    const report = window.location.hash.substr(1);
    switch (report) {
        case 'build-pipelines':
            element = (<BuildPipelines compliancyCheckerService={compliancyCheckerService} azDoService={azDoService} />)
            break;
        case 'release-pipelines':
            element = (<ReleasePipelines compliancyCheckerService={compliancyCheckerService} azDoService={azDoService} />)
            break;
        case 'builds':
            element = (<Builds azDoService={azDoService} />);
            break;
        case 'repositories':
            element = (<Repositories compliancyCheckerService={compliancyCheckerService} azDoService={azDoService} />);
            break;
        case 'releases':
            element = (<Releases azDoService={azDoService} />);
            break;
        case 'overview':
            element = (<Overview compliancyCheckerService={compliancyCheckerService} azDoService={azDoService} />);
            break;
        default:
            element = (<span className="error">No report specified.</span>);
    }
    return element;
}

