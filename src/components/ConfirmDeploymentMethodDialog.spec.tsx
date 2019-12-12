import React from "react";

import { render } from "@testing-library/react";

import ConfirmDeploymentMethodDialog from "./ConfirmDeploymentMethodDialog";

describe("ConfirmDeploymentMethodDialog", () => {
    it("should render the dialog", async () => {
        const { findByText } = render(
            <ConfirmDeploymentMethodDialog
                projectId={"abc"}
                itemId={"2"}
                environments={[
                    { id: "1", name: "DEV" },
                    { id: "2", name: "PROD" }
                ]}
                onReconcileCompleted={() => {}}
                onCancel={() => {}}
            />
        );

        expect(
            await findByText("Select the production environment")
        ).toBeDefined();

        const btn = (await findByText("Copy")).closest("button");
        expect(btn).toBeDefined();
        expect(btn!.hasAttribute("disabled"));
    });
});
