import * as React from "react";
import * as ReactDOM from "react-dom";
import Report from "./Repositories";
import { DummyAzDoService } from "./services/DummyAzDoService";
import { DummyCompliancyCheckerService } from "./services/DummyCompliancyCheckerService";

describe("Repositories", () => {
    it("renders without crashing", () => {
        const div = document.createElement("div");
        const dummyAzDoService = new DummyAzDoService();
        ReactDOM.render(
            <Report
                azDoService={dummyAzDoService}
                compliancyCheckerService={
                    new DummyCompliancyCheckerService(dummyAzDoService)
                }
            />,
            div
        );
        ReactDOM.unmountComponentAtNode(div);
    });
});
