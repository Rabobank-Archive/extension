import fetchMock from "fetch-mock";
import { cleanup } from "react-testing-library";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

afterEach(fetchMock.reset);
afterEach(cleanup);

jest.setTimeout(10e3);

// we need to fake mock these modules since they use RequireJS and Jest can't handle that...
// see https://stackoverflow.com/questions/40919028/define-is-not-defined-in-jest-when-testing-es6-module-with-requirejs-dependenc
jest.mock("azure-devops-extension-sdk", () => {});
jest.mock("azure-devops-extension-api", () => {});

// mock higher order function withAITracking to just return the component itself, as we don't need AI tracking in tests
jest.mock("@microsoft/applicationinsights-react-js", () => {
    return {
        withAITracking: jest.fn(
            (
                reactPlugin: ReactPlugin,
                Component: React.ComponentType,
                componentName?: string
            ) => {
                return Component;
            }
        )
    };
});

// mock tracking functions to do nothing as we don't need AI tracking in tests
jest.mock("./services/ApplicationInsights", () => {
    return {
        appInsightsReactPlugin: {},
        trackPageview: jest.fn(() => {}),
        trackException: jest.fn(() => {}),
        trackTrace: jest.fn(() => {}),
        trackEvent: jest.fn(() => {})
    };
});
