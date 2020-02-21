import * as React from "react";
import OverviewReport from "./Overview";
import { useReport } from "./hooks/useReport";
import {
    render,
    getByTestId,
    wait,
    waitForElement,
    waitForElementToBeRemoved
} from "@testing-library/react";

jest.mock("./hooks/useReport", () => ({
    useReport: jest.fn()
}));

describe("Overview", () => {
    it("shows loading", async () => {
        (useReport as jest.Mock).mockReturnValue({ loading: true });
        const { getByTestId } = render(<OverviewReport />);

        getByTestId("loading");
    });

    it("hides loading label when not loading", async () => {
        (useReport as jest.Mock).mockReturnValue({ loading: false });
        const { queryByTestId } = render(<OverviewReport />);

        const loading = queryByTestId("loading");
        expect(loading).toBeNull();
    });
});
