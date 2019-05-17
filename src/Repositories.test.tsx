import * as React from "react";
import * as ReactDOM from "react-dom";
import Report from "./Repositories";
import { DummyAzDoService } from "./services/DummyAzDoService";

describe("Repositories", () => {
    it("renders without crashing", () => {
        const div = document.createElement("div");
        ReactDOM.render(<Report azDoService={new DummyAzDoService()} />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
