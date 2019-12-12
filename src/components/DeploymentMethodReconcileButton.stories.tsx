import React from "react";
import { storiesOf } from "@storybook/react";
import DeploymentMethodReconcileButton from "./DeploymentMethodReconcileButton";

storiesOf("DeploymentMethodReconcileButton", module).add("default", () => (
    <DeploymentMethodReconcileButton
        projectId={"abc"}
        itemId={"2"}
        environments={[
            { id: "1", name: "DEV" },
            { id: "2", name: "PROD" }
        ]}
    />
));
