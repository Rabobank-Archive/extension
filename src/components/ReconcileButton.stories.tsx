import React from "react";
import { storiesOf } from "@storybook/react";
import ReconcileButton from "./ReconcileButton";

storiesOf("ReconcileButton", module).add("default", () => (
    <ReconcileButton
        reconcilableItem={{
            reconcileUrl: "/mock-url",
            reconcileImpact: [
                "Rabobank Project Administrators group is created and added to Project Administrators",
                "Delete team project permissions of the Rabobank Project Administrators group is set to deny",
                "Members of the Project Administrators are moved to Rabobank Project Administrators",
                "Delete team project permission is set to 'not set' for all other groups"
            ]
        }}
        reconcileDisabled={false}
    />
));
