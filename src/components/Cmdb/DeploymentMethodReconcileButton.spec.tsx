import React from "react";

import { fireEvent, render } from "@testing-library/react";
import DeploymentMethodReconcileButton from "./DeploymentMethodReconcileButton";

describe("DeploymentMethodReconcileButton", () => {
    it("should render the reconcile button", async () => {
        const { getByText, getAllByText, getByPlaceholderText } = render(
            <DeploymentMethodReconcileButton
                environments={[
                    { id: "1", name: "DEV" },
                    { id: "2", name: "PROD" }
                ]}
                reconcilableItem={{
                    reconcileUrl: "/mock-url",
                    reconcileImpact: ["mock-impact"]
                }}
            />
        );

        fireEvent.click(getByText("Reconcile"));

        const reconcileButtons = getAllByText("Reconcile");
        expect(reconcileButtons).toHaveLength(2);

        const btn = reconcileButtons[1].closest("button");
        expect(btn!.classList).toContain("disabled");

        const ciInput = getByPlaceholderText("CIxxxxxxx").closest("input");
        expect(ciInput).toBeDefined();

        const environmentDropdown = getByPlaceholderText(
            "Select the production stage"
        ).closest("input");
        expect(environmentDropdown).toBeDefined();
    });
});
