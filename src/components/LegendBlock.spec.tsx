import React from "react";
import { render } from "@testing-library/react";
import LegendBlock from "./LegendBlock";

describe("LegendBlock", () => {
    it("should render the legend", async () => {
        const legend = render(<LegendBlock />);
        await legend.findAllByText("Legend");
    });
});
