import * as React from "react";
import * as ReactDOM from "react-dom";
import OverviewReport from "./Overview";
import { DummyAzDoService } from "./services/DummyAzDoService";
import { DummyCompliancyCheckerService } from "./services/DummyCompliancyCheckerService";

describe("Overview", () => {
    it("renders without crashing", () => {
        const div = document.createElement("div");
        const dummyAzDoService = new DummyAzDoService();
        ReactDOM.render(
            <OverviewReport
                azDoService={dummyAzDoService}
                compliancyCheckerService={
                    new DummyCompliancyCheckerService(dummyAzDoService)
                }
            />,
            div
        );
    });
});
