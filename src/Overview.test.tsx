import * as React from "react";
import * as ReactDOM from "react-dom";
import OverviewReport from "./Overview";
import { DummyCompliancyCheckerService } from "./services/DummyCompliancyCheckerService";

describe("Overview", () => {
    it("renders without crashing", () => {
        const div = document.createElement("div");
        ReactDOM.render(
            <OverviewReport
                compliancyCheckerService={new DummyCompliancyCheckerService()}
            />,
            div
        );
    });
});
