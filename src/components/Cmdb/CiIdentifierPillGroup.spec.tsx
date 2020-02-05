import React from "react";
import CiIdentifierPillGroup from "./CiIdentifierPillGroup";
import { render } from "@testing-library/react";

describe("CiIdentifierPillGroup", () => {
    it("should show when ci identifiers is set", async () => {
        const { findByText } = render(
            <CiIdentifierPillGroup ciIdentifiers={"CI12345,CI423121"} />
        );

        await findByText("CI12345");
    });
});
