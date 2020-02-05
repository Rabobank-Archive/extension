import React from "react";

import { render } from "@testing-library/react";

import DeploymentMethodConfirmReconcileDialog from "./DeploymentMethodConfirmReconcileDialog";

describe("DeploymentMethodConfirmReconcileDialog", () => {
    it("should render the dialog", async () => {
        const { findByText } = render(
            <DeploymentMethodConfirmReconcileDialog
                impact={[
                    "Rabobank Project Administrators group is created and added to Project Administrators",
                    "Delete team project permissions of the Rabobank Project Administrators group is set to deny",
                    "Members of the Project Administrators are moved to Rabobank Project Administrators",
                    "Delete team project permission is set to 'not set' for all other groups"
                ]}
                reconcileUrl={"Mock url"}
                onReconcileCompleted={() => {}}
                onCancel={() => {}}
            />
        );

        expect(
            await findByText(
                "Delete team project permissions of the Rabobank Project Administrators group is set to deny"
            )
        ).toBeDefined();

        const btn = (await findByText("Reconcile")).closest("button");
        expect(btn).toBeDefined();
        expect(btn!.hasAttribute("disabled"));
    });
});
