import React, { useState, useEffect } from "react";
import { Dialog } from "azure-devops-ui/Dialog";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { UnorderedList } from "./UnorderedList";
import { DoReconcileRequest } from "../services/CompliancyCheckerService";
import ErrorBar from "./ErrorBar";
import ReconcileLoader from "./ReconcileLoader";

interface IConfirmReconcileDialogProps {
    reconcileUrl: string;
    impact: string[];
    onReconcileCompleted?: () => void;
    onCancel?: () => void;
    onReconcile?: () => void;
}

const ConfirmReconcileDialog = ({
    impact,
    reconcileUrl,
    onReconcileCompleted,
    onCancel,
    onReconcile = () => {}
}: IConfirmReconcileDialogProps) => {
    const [isReconciling, setIsReconciling] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");

    useEffect(() => {
        const doFetch = async () => {
            try {
                onReconcile();
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
    }, [isReconciling, onReconcileCompleted, reconcileUrl, onReconcile]);

    return (
        <Dialog
            titleProps={{ text: "Confirm reconciliation" }}
            footerButtonProps={[
                {
                    text: "Cancel",
                    onClick: () => {
                        setErrorText("");
                        if (onCancel) onCancel();
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
            <ErrorBar message={errorText} onDismiss={() => setErrorText("")} />
            {isReconciling && <ReconcileLoader />}
            <p>Are you sure? Reconciling will make the following changes:</p>
            <UnorderedList
                itemProvider={new ArrayItemProvider<string>(impact)}
            />
        </Dialog>
    );
};

export default ConfirmReconcileDialog;
