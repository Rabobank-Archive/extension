import React from "react";
import { storiesOf } from "@storybook/react";
import ConfirmReconcileDialog from "./ConfirmReconcileDialog";

storiesOf("ConfirmReconcileDialog", module).add("default", () => (
    <ConfirmReconcileDialog
        impact={[
            "Rabobank Project Administrators group is created and added to Project Administrators",
            "Delete team project permissions of the Rabobank Project Administrators group is set to deny",
            "Members of the Project Administrators are moved to Rabobank Project Administrators",
            "Delete team project permission is set to 'not set' for all other groups"
        ]}
        reconcileUrl={"Mock url"}
    />
));
