import * as React from "react";
import * as ReactDOM from "react-dom";
import OverviewReport from "./Overview";

describe("Overview", () => {
    it("renders without crashing", () => {
        const div = document.createElement("div");
        ReactDOM.render(<OverviewReport />, div);
    });
});
