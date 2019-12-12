import React from "react";

import { fireEvent, render, wait } from "@testing-library/react";
import DeploymentMethodReconcileButton from "./DeploymentMethodReconcileButton";

describe("DeploymentMethodReconcileButton", () => {
    it("should render the reconcile button", async () => {
        const { getByText, findByText } = render(
            <DeploymentMethodReconcileButton
                projectId={"abc"}
                itemId={"2"}
                environments={[
                    { id: "1", name: "DEV" },
                    { id: "2", name: "PROD" }
                ]}
            />
        );

        fireEvent.click(getByText("Reconcile"));

        wait(async () => {
            expect(await findByText("Create Deployment Method")).toBeDefined();
        });
    });
});
