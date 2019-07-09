import React, { useState, useEffect } from "react";
import { Dialog } from "azure-devops-ui/Dialog";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { UnorderedList } from "./UnorderedList";
import { DoReconcileRequest } from "../services/CompliancyCheckerService";
import {
    appInsightsReactPlugin,
    trackEvent,
    trackException
} from "../services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import ErrorBar from "./ErrorBar";

interface IConfirmReconcileDialogProps {
    reconcileUrl: string;
    impact: string[];
    onReconcileCompleted?: () => void;
    onCancel?: () => void;
}

const ConfirmReconcileDialog = ({
    impact,
    reconcileUrl,
    onReconcileCompleted,
    onCancel
}: IConfirmReconcileDialogProps) => {
    const [isReconciling, setIsReconciling] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");

    useEffect(() => {
        trackEvent("[Confirm Reconcile Dialog] Opened");
    }, []);

    useEffect(() => {
        const doFetch = async () => {
            try {
                await DoReconcileRequest(reconcileUrl);
                setErrorText("");
                trackEvent("[Confirm Reconcile Dialog] Reconcile completed");
                if (onReconcileCompleted) onReconcileCompleted();
            } catch (e) {
                setErrorText("Couldn't fulfill reconcile request.");
                trackException(e);
            }
            setIsReconciling(false);
        };

        if (isReconciling) {
            doFetch();
        }
    }, [isReconciling, onReconcileCompleted, reconcileUrl]);

    return (
        <Dialog
            titleProps={{ text: "Confirm reconciliation" }}
            footerButtonProps={[
                {
                    text: "Cancel",
                    onClick: () => {
                        setErrorText("");
                        trackEvent("[Confirm Reconcile Dialog] Cancelled");
                        if (onCancel) onCancel();
                    }
                },
                {
                    text: "Reconcile",
                    onClick: () => {
                        setIsReconciling(true);
                        trackEvent("[Confirm Reconcile Dialog] Confirmed");
                    },
                    primary: true,
                    disabled: isReconciling
                }
            ]}
            onDismiss={() => {
                setErrorText("");
            }}
        >
            <ErrorBar message={errorText} onDismiss={() => setErrorText("")} />
            {isReconciling && (
                <Status
                    {...Statuses.Running}
                    key="reconciling"
                    // @ts-ignore
                    size={StatusSize.xl}
                    text="Reconciling..."
                />
            )}
            <p>Are you sure? Reconciling will make the following changes:</p>
            <UnorderedList
                itemProvider={new ArrayItemProvider<string>(impact)}
            />
        </Dialog>
    );
};

export default withAITracking(appInsightsReactPlugin, ConfirmReconcileDialog);
