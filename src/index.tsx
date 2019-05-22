import React from "react";
import * as ReactDOM from "react-dom";
import Repositories from "./Repositories";
import Releases from "./Releases";
import Overview from "./Overview";
import Builds from "./Builds";
import BuildPipelines from "./BuildPipelines";
import ReleasePipelines from "./ReleasePipelines";

import * as SDK from "azure-devops-extension-sdk";

if (process.env.REACT_APP_USE_AZDO_SDK === "true") {
    SDK.init();
    SDK.ready().then(() => {
        let element: JSX.Element = GetRootElement();
        ReactDOM.render(element, document.getElementById("root"));
        SDK.notifyLoadSucceeded();
    });
} else {
    let element: JSX.Element = GetRootElement();
    ReactDOM.render(element, document.getElementById("root"));
}

function GetRootElement() {
    // Not using react router because the paths are incompatible
    // with static hosting on Azure Devops extensions therefore
    // using index.html#report as identifier.
    let element: JSX.Element;
    const report = window.location.hash.substr(1);
    switch (report) {
        case "build-pipelines":
            element = <BuildPipelines />;
            break;
        case "release-pipelines":
            element = <ReleasePipelines />;
            break;
        case "builds":
            element = <Builds />;
            break;
        case "repositories":
            element = <Repositories />;
            break;
        case "releases":
            element = <Releases />;
            break;
        case "overview":
            element = <Overview />;
            break;
        default:
            element = <span className="error">No report specified.</span>;
    }
    return element;
}
