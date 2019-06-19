import {
    ApplicationInsights,
    SeverityLevel
} from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
import { createBrowserHistory } from "history";
import { USE_APP_INSIGHTS } from "./Environment";
import { ICustomProperties } from "@microsoft/applicationinsights-core-js";

const browserHistory = createBrowserHistory({ basename: "" });
const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: "__##INSTRUMENTATIONKEY##__",
        extensions: [reactPlugin],
        extensionConfig: {
            [reactPlugin.identifier]: browserHistory
        },
        disableFetchTracking: false,
        disableExceptionTracking: false,
        disableAjaxTracking: false,
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

export const trackTrace = (
    text: string,
    customProperties?: ICustomProperties
) => {
    appInsights.trackTrace(
        {
            message: text,
            severityLevel: SeverityLevel.Information
        },
        customProperties
    );
};

export const trackEvent = (text: string) => {
    appInsights.trackEvent({ name: text });
};

export const trackPageview = () => {
    appInsights.trackPageView();
};

export { reactPlugin as appInsightsReactPlugin };
