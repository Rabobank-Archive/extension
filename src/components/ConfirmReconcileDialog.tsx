import React, { useState, useEffect } from "react";
import { Dialog } from "azure-devops-ui/Dialog";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { UnorderedList } from "./UnorderedList";
import { DoReconcileRequest } from "../services/CompliancyCheckerService";

interface IConfirmReconcileDialogProps {
    reconcileUrl: string;
    impact: string[];
    onReconcileCompleted?: () => void;
}

export const ConfirmReconcileDialog = ({
    impact,
    reconcileUrl,
    onReconcileCompleted
}: IConfirmReconcileDialogProps) => {
    const [isReconciling, setIsReconciling] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");

    useEffect(() => {
        const doFetch = async () => {
            try {
                await DoReconcileRequest(reconcileUrl);
                setErrorText("");
                if (onReconcileCompleted) onReconcileCompleted();
            } catch (e) {
                setErrorText("Couldn't fulfill reconcile request.");
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
                    }
                },
                {
                    text: "Reconcile",
                    onClick: () => {
                        setIsReconciling(true);
                    },
                    primary: true,
                    disabled: isReconciling
                }
            ]}
            onDismiss={() => {
                setErrorText("");
            }}
        >
            {errorText && (
                <MessageCard
                    // @ts-ignore
                    severity={MessageCardSeverity.Error}
                    onDismiss={() => {
                        setErrorText("");
                    }}
                >
                    {errorText}
                </MessageCard>
            )}
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
