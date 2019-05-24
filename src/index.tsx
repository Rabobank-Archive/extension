import React, { Component } from "react";
import { HashRouter, Route } from "react-router-dom";
import * as ReactDOM from "react-dom";
import Repositories from "./Repositories";
import Releases from "./Releases";
import Overview from "./Overview";
import Builds from "./Builds";
import BuildPipelines from "./BuildPipelines";
import ReleasePipelines from "./ReleasePipelines";

import * as SDK from "azure-devops-extension-sdk";
import { USE_AZDO_SDK } from "./services/Environment";

class App extends Component {
    render() {
        return (
            <HashRouter hashType="noslash">
                <div>
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
                    <Route path="/builds" component={Builds} />
                    <Route path="/repositories" component={Repositories} />
                    <Route path="/releases" component={Releases} />
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
