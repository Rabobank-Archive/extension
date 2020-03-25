import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import * as ReactDOM from "react-dom";
import Repositories from "./Repositories";
import Overview from "./Overview";
import BuildPipelines from "./BuildPipelines";
import ReleasePipelines from "./ReleasePipelines";
import "azure-devops-ui/Core/override.css";

import * as SDK from "azure-devops-extension-sdk";
import { USE_AZDO_SDK } from "./services/Environment";

class App extends Component {
    render() {
        return (
            <HashRouter hashType="noslash">
                <div className="flex-grow">
                    <Route
                        exact
                        path="/"
                        component={() => {
                            return (
                                <span className="error">
                                    No report specified.
                                </span>
                            );
                        }}
                    />
                    <Route path="/build-pipelines" component={BuildPipelines} />
                    <Route
                        path="/release-pipelines"
                        component={ReleasePipelines}
                    />
                    <Route path="/repositories" component={Repositories} />
                    <Route path="/overview" component={Overview} />
                </div>
            </HashRouter>
        );
    }
}

if (USE_AZDO_SDK) {
    SDK.init();
    SDK.ready().then(() => {
        ReactDOM.render(<App />, document.getElementById("root"));
        SDK.notifyLoadSucceeded();
    });
} else {
    ReactDOM.render(<App />, document.getElementById("root"));
}
