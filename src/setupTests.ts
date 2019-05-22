import fetchMock from "fetch-mock";
import { cleanup } from "react-testing-library";

afterEach(fetchMock.reset);
afterEach(cleanup);

jest.setTimeout(10e3);

// we need to fake mock these modules since they use RequireJS and Jest can't handle that...
// see https://stackoverflow.com/questions/40919028/define-is-not-defined-in-jest-when-testing-es6-module-with-requirejs-dependenc
jest.mock("azure-devops-extension-sdk", () => {});
jest.mock("azure-devops-extension-api", () => {});
