import * as React from "react";
import { useState, ReactNode } from "react";
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
        name?: string | null | undefined;
    };
    children?: ReactNode;
    data?: {};
    reconcileDisabled: boolean;
    onReconcile?: () => void;
}

const ReconcileButton = ({
    reconcilableItem,
    children,
    data,
    reconcileDisabled,
    onReconcile = () => {}
}: IReconcileButtonProps) => {
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
            {isDialogOpen ? (
                <ConfirmReconcileDialog
                    impact={reconcilableItem.reconcileImpact}
                    reconcileUrl={reconcilableItem.reconcileUrl}
                    reconcileDisabled={reconcileDisabled}
                    onReconcileCompleted={() => {
                        setIsDialogOpen(false);
                    }}
                    onCancel={() => {
                        setIsDialogOpen(false);
                    }}
                    data={data}
                    onReconcile={onReconcile}
                >
                    {children}
                </ConfirmReconcileDialog>
            ) : (
                ""
            )}
        </div>
    );
};

export default withAITracking(appInsightsReactPlugin, ReconcileButton);
