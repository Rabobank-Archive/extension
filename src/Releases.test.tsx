import * as React from "react";
import * as ReactDOM from "react-dom";
import Report from "./Releases";

describe("Releases", () => {
    it("renders without crashing", () => {
        const div = document.createElement("div");
        ReactDOM.render(<Report />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
