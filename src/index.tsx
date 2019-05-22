import React from "react";
import * as ReactDOM from "react-dom";
import Repositories from "./Repositories";
import Releases from "./Releases";
import Overview from "./Overview";
import Builds from "./Builds";
import BuildPipelines from "./BuildPipelines";
import ReleasePipelines from "./ReleasePipelines";

import { ICompliancyCheckerService } from "./services/ICompliancyCheckerService";
import { CompliancyCheckerService } from "./services/CompliancyCheckerService";
import { DummyCompliancyCheckerService } from "./services/DummyCompliancyCheckerService";

import * as SDK from "azure-devops-extension-sdk";

let compliancyCheckerService: ICompliancyCheckerService;

if (process.env.REACT_APP_USE_COMPLIANCYCHECKER_SERVICE === "true") {
    compliancyCheckerService = new CompliancyCheckerService();
} else {
    compliancyCheckerService = new DummyCompliancyCheckerService();
}

if (process.env.REACT_APP_USE_AZDO_SDK === "true") {
    SDK.init();
    SDK.ready().then(() => {
        let element: JSX.Element = GetRootElement(compliancyCheckerService);
        ReactDOM.render(element, document.getElementById("root"));
        SDK.notifyLoadSucceeded();
    });
} else {
    let element: JSX.Element = GetRootElement(compliancyCheckerService);
    ReactDOM.render(element, document.getElementById("root"));
}

function GetRootElement(compliancyCheckerService: ICompliancyCheckerService) {
    // Not using react router because the paths are incompatible
    // with static hosting on Azure Devops extensions therefore
    // using index.html#report as identifier.
    let element: JSX.Element;
    const report = window.location.hash.substr(1);
    switch (report) {
        case "build-pipelines":
            element = (
                <BuildPipelines
                    compliancyCheckerService={compliancyCheckerService}
                />
            );
            break;
        case "release-pipelines":
            element = (
                <ReleasePipelines
                    compliancyCheckerService={compliancyCheckerService}
                />
            );
            break;
        case "builds":
            element = <Builds />;
            break;
        case "repositories":
            element = (
                <Repositories
                    compliancyCheckerService={compliancyCheckerService}
                />
            );
            break;
        case "releases":
            element = <Releases />;
            break;
        case "overview":
            element = (
                <Overview compliancyCheckerService={compliancyCheckerService} />
            );
            break;
        default:
            element = <span className="error">No report specified.</span>;
    }
    return element;
}
