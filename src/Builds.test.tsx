import * as React from "react";
import Report from "./Builds";
import { render } from "@testing-library/react";
import { useReport } from "./hooks/useReport";
import "@testing-library/jest-dom";

jest.mock("./hooks/useReport", () => ({
    useReport: jest.fn()
}));

describe("Builds", () => {
    it("shows loading", async () => {
        (useReport as jest.Mock).mockReturnValue({ loading: true });
        const { queryByTestId } = render(<Report />);

        const loading = queryByTestId("loading");
        expect(loading).not.toBeNull();
    });

    it("hides loading label when not loading", async () => {
        (useReport as jest.Mock).mockReturnValue({
            loading: false,
            data: { reports: [] }
        });
        const { queryByTestId } = render(<Report />);

        const loading = queryByTestId("loading");
        expect(loading).toBeNull();
    });

    it("shows error", async () => {
        (useReport as jest.Mock).mockReturnValue({
            loading: false,
            data: { reports: [] },
            error: "hi"
        });
        const { getByRole } = render(<Report />);

        const error = getByRole("alert");
        expect(error).toHaveTextContent("hi");
    });
});
