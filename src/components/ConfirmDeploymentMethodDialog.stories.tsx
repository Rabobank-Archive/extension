import React from "react";
import { storiesOf } from "@storybook/react";
import ConfirmDeploymentMethodDialog from "./ConfirmDeploymentMethodDialog";

storiesOf("ConfirmDeploymentMethodDialog", module).add("default", () => (
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
));
