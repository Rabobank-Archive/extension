import React, { useState } from "react";
import { IEnvironment } from "../../services/IAzDoService";
import { Button } from "azure-devops-ui/Button";
import DeploymentMethodConfirmReconcileDialog from "./DeploymentMethodConfirmReconcileDialog";
import { trackEvent } from "../../services/ApplicationInsights";

const DeploymentMethodReconcileButton = ({
    reconcilableItem,
    environments
}: {
    reconcilableItem: {
        reconcileUrl: string;
        reconcileImpact: string[];
        name?: string | null | undefined;
    };
    environments?: IEnvironment[];
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    return (
        <div>
            <Button
                primary={true}
                iconProps={{ iconName: "TriggerAuto" }}
                onClick={() => {
                    setIsDialogOpen(true);
                    trackEvent("[Deployment Method Reconcile Button] Clicked");
                }}
                text="Reconcile"
                disabled={reconcilableItem.reconcileUrl === ""}
            />
            {isDialogOpen ? (
                <DeploymentMethodConfirmReconcileDialog
                    impact={reconcilableItem.reconcileImpact}
                    reconcileUrl={reconcilableItem.reconcileUrl}
                    onReconcileCompleted={() => {
                        setIsDialogOpen(false);
                    }}
                    onCancel={() => {
                        setIsDialogOpen(false);
                    }}
                    environments={environments}
                ></DeploymentMethodConfirmReconcileDialog>
            ) : (
                ""
            )}
        </div>
    );
};

export default DeploymentMethodReconcileButton;
