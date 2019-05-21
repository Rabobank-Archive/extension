import React, { useState, useEffect } from "react";
import { Dialog } from "azure-devops-ui/Dialog";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { ICompliancyCheckerService } from "../services/ICompliancyCheckerService";
import { UnorderedList } from "./UnorderedList";

interface IConfirmReconcileDialogProps {
    reconcileUrl: string;
    impact: string[];
    compliancyCheckerService: ICompliancyCheckerService;
    onReconcileCompleted?: () => void;
}

export const ConfirmReconcileDialog = ({
    impact,
    reconcileUrl,
    compliancyCheckerService,
    onReconcileCompleted
}: IConfirmReconcileDialogProps) => {
    const [isReconciling, setIsReconciling] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");

    useEffect(() => {
        const doFetch = async () => {
            try {
                await compliancyCheckerService.DoReconcileRequest(reconcileUrl);
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
    }, [
        compliancyCheckerService,
        isReconciling,
        onReconcileCompleted,
        reconcileUrl
    ]);

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
