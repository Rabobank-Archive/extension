import React from "react";
import ErrorBar from "./ErrorBar";
import { render } from "@testing-library/react";

describe("ErrorBar", () => {
    it("should show when message is set", async () => {
        const { findByText } = render(<ErrorBar message="Dummy message" />);

        await findByText("Contact TAS");
    });

    it("shouldn't show when no message is set", async () => {
        const { queryByText } = render(<ErrorBar message="" />);

        var visibleButton = await queryByText("Contact TAS");
        expect(visibleButton).toBeNull();
    });

    it("should render correctly when link properties are set", async () => {
        const { findByText } = render(
            <ErrorBar
                message="some message"
                linkProps={{ text: "link text", link: "https://somelink.com" }}
            />
        );

        await findByText("link text");
    });
});
