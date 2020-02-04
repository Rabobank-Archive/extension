import React from "react";
import { render } from "@testing-library/react";
import CompliancyHeader from "./CompliancyHeader";
import "@testing-library/jest-dom";

describe("CompliancyHeader", () => {
    it("show last scan date", async () => {
        const { queryByTestId } = render(
            <CompliancyHeader
                headerText="test"
                lastScanDate={new Date(1996, 1, 1)}
            />
        );

        const label = queryByTestId("scan-label");
        expect(label).not.toBeNull();
    });

    it("hides scan date when not defined", async () => {
        const { queryByTestId } = render(
            <CompliancyHeader headerText="test" lastScanDate={undefined} />
        );

        const label = queryByTestId("scan-label");
        expect(label).toBeNull();
    });

    it("enabled rescan button with rescanUrl", async () => {
        const { getByRole } = render(
            <CompliancyHeader headerText="test" rescanUrl="something" />
        );

        const menubar = getByRole("menubar");
        const button = menubar.children[0];
        expect(button).not.toBeNull();
        expect(button).toHaveAttribute("aria-disabled", "false");
    });

    it("disabled rescan button without rescanUrl", async () => {
        const { getByRole } = render(<CompliancyHeader headerText="test" />);

        const menubar = getByRole("menubar");
        const button = menubar.children[0];
        expect(button).not.toBeNull();
        expect(button).toHaveAttribute("aria-disabled", "true");
    });
});
