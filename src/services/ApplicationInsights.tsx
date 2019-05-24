import {
    ApplicationInsights,
    SeverityLevel
} from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { createBrowserHistory } from "history";
import { USE_APP_INSIGHTS } from "./Environment";

const browserHistory = createBrowserHistory({ basename: "" });
const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: "__INSTRUMENTATIONKEY__",
        extensions: [reactPlugin],
        extensionConfig: {
            [reactPlugin.identifier]: browserHistory
        },
        disableFetchTracking: false,
        disableTelemetry: !USE_APP_INSIGHTS
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
