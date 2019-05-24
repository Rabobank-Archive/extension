import * as React from "react";
import { useState } from "react";
import { Button } from "azure-devops-ui/Button";
import ConfirmReconcileDialog from "./ConfirmReconcileDialog";
import {
    appInsightsReactPlugin,
    trackEvent
} from "../services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";

interface IReconcileButtonProps {
    reconcilableItem: {
        reconcileUrl: string;
        reconcileImpact: string[];
    };
}

const ReconcileButton = ({ reconcilableItem }: IReconcileButtonProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    return (
        <div>
            <Button
                primary={true}
                iconProps={{ iconName: "TriggerAuto" }}
                onClick={() => {
                    setIsDialogOpen(true);
                    trackEvent("[Reconcile Button] Clicked");
                }}
                text="Reconcile"
                disabled={reconcilableItem.reconcileUrl === ""}
            />
            {isDialogOpen && (
                <ConfirmReconcileDialog
                    impact={reconcilableItem.reconcileImpact}
                    reconcileUrl={reconcilableItem.reconcileUrl}
                    onReconcileCompleted={() => {
                        setIsDialogOpen(false);
                    }}
                    onCancel={() => {
                        setIsDialogOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default withAITracking(appInsightsReactPlugin, ReconcileButton);
