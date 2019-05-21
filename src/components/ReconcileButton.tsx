import * as React from "react";
import { useState } from "react";
import { Button } from "azure-devops-ui/Button";
import { ICompliancyCheckerService } from "../services/ICompliancyCheckerService";
import { ConfirmReconcileDialog } from "./ConfirmReconcileDialog";

interface IReconcileButtonProps {
    reconcilableItem: {
        reconcileUrl: string;
        reconcileImpact: string[];
        compliancyCheckerService: ICompliancyCheckerService;
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
                    compliancyCheckerService={
                        reconcilableItem.compliancyCheckerService
                    }
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
