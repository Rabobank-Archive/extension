import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "azure-devops-ui/Button";
import {
    appInsightsReactPlugin,
    trackEvent
} from "../services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { IEnvironment } from "../services/IAzDoService";
import ConfirmDeploymentMethodDialog from "./ConfirmDeploymentMethodDialog";
import { Toast } from "azure-devops-ui/Toast";

interface IReconcileButtonProps {
    environments?: IEnvironment[];
    projectId: string;
    itemId: string;
}

const DeploymentMethodReconcileButton = ({
    environments,
    projectId,
    itemId
}: IReconcileButtonProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
    const toastRef = useRef<Toast>(null);

    useEffect(() => {
        const showToast = async () => {
            const timer = setTimeout(async () => {
                toastRef!.current!.fadeOut().promise.then(() => {
                    setIsToastVisible(false);
                });
            }, 2000);
            return () => clearTimeout(timer);
        };

        if (isToastVisible && toastRef && toastRef.current) {
            showToast();
        }
    }, [isToastVisible, toastRef]);

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
                disabled={false}
            />
            {isDialogOpen && (
                <ConfirmDeploymentMethodDialog
                    onReconcileCompleted={() => {
                        setIsDialogOpen(false);
                        setIsToastVisible(true);
                    }}
                    onCancel={() => {
                        setIsDialogOpen(false);
                    }}
                    environments={environments}
                    projectId={projectId}
                    itemId={itemId}
                />
            )}
            {isToastVisible && (
                <Toast
                    ref={toastRef}
                    message="Copied the deployment method JSON to the clipboard."
                />
            )}
        </div>
    );
};

export default withAITracking(
    appInsightsReactPlugin,
    DeploymentMethodReconcileButton
);
