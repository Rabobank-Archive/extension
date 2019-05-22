import * as React from "react";
import * as ReactDOM from "react-dom";
import Report from "./Repositories";
import { DummyCompliancyCheckerService } from "./services/DummyCompliancyCheckerService";

describe("Repositories", () => {
    it("renders without crashing", () => {
        const div = document.createElement("div");
        ReactDOM.render(
            <Report
                compliancyCheckerService={new DummyCompliancyCheckerService()}
            />,
            div
        );
        ReactDOM.unmountComponentAtNode(div);
    });
});
