import React from "react";
import {
    ApplicationInsights,
    SeverityLevel
} from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { createBrowserHistory } from "history";

const browserHistory = createBrowserHistory({ basename: "" });
const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: "1901ad10-222c-4d17-84ff-d4d840177b30",
        extensions: [reactPlugin],
        extensionConfig: {
            [reactPlugin.identifier]: browserHistory
        }
    }
});
appInsights.loadAppInsights();

export const trackException = (text: string) => {
    appInsights.trackException({
        error: new Error(text),
        severityLevel: SeverityLevel.Error
    });
};

export const trackTrace = (text: string) => {
    appInsights.trackTrace({
        message: text,
        severityLevel: SeverityLevel.Information
    });
};

export const trackEvent = (text: string) => {
    appInsights.trackEvent({ name: text });
};

export { reactPlugin as appInsightsReactPlugin };
