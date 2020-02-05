import React from "react";
import { storiesOf } from "@storybook/react";
import DeploymentMethodReconcileButton from "./DeploymentMethodReconcileButton";

storiesOf("DeploymentMethodReconcileButton", module).add("default", () => (
    <DeploymentMethodReconcileButton
        reconcilableItem={{
            reconcileUrl: "/mock-url",
            reconcileImpact: [
                "In the CMDB the deployment method for the CI is set to Azure DevOps and coupled to this release pipeline"
            ]
        }}
        environments={[
            { id: "1", name: "UAT" },
            { id: "2", name: "PROD" }
        ]}
    />
));
