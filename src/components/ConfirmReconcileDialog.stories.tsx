import React from "react";
import { storiesOf } from "@storybook/react";
import { ConfirmReconcileDialog } from "./ConfirmReconcileDialog";
import { DummyAzDoService } from "../services/DummyAzDoService";
import { DummyCompliancyCheckerService } from "../services/DummyCompliancyCheckerService";

storiesOf("ConfirmReconcileDialog", module).add("default", () => (
    <ConfirmReconcileDialog
        compliancyCheckerService={
            new DummyCompliancyCheckerService(new DummyAzDoService())
        }
        impact={["Some impact"]}
        reconcileUrl={"Mock url"}
    />
));
