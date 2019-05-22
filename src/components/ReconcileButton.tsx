import * as React from "react";
import { useState } from "react";
import { Button } from "azure-devops-ui/Button";
import { ConfirmReconcileDialog } from "./ConfirmReconcileDialog";

interface IReconcileButtonProps {
    reconcilableItem: {
        reconcileUrl: string;
        reconcileImpact: string[];
    };
}

export const ReconcileButton = ({
    reconcilableItem
}: IReconcileButtonProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    return (
        <div>
            <Button
                primary={true}
                iconProps={{ iconName: "TriggerAuto" }}
                onClick={() => {
                    setIsDialogOpen(true);
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
                />
            )}
        </div>
    );
};

export default ReconcileButton;
