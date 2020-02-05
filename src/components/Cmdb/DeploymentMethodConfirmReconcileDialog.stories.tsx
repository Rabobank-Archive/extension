import React from "react";
import { storiesOf } from "@storybook/react";
import DeploymentMethodConfirmReconcileDialog from "./DeploymentMethodConfirmReconcileDialog";

storiesOf("DeploymentMethodConfirmReconcileDialog", module).add(
    "default",
    () => (
        <DeploymentMethodConfirmReconcileDialog
            impact={[
                "In the CMDB the deployment method for the CI is set to Azure DevOps and coupled to this release pipeline"
            ]}
            reconcileUrl={"Mock url"}
            environments={[
                { id: "1", name: "UAT" },
                { id: "2", name: "PROD" }
            ]}
        />
    )
);
