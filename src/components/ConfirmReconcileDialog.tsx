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
    onCompleted: () => void;
    onCancel: () => void;
}

const ConfirmReconcileDialog = ({
    impact,
    reconcileUrl,
    onCompleted,
    onCancel,
}: IConfirmReconcileDialogProps) => {
    const [isReconciling, setIsReconciling] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        const doFetch = async () => {
            try {
                await DoReconcileRequest(reconcileUrl);
                setIsDone(true);
            } catch (e) {
                setErrorText("Couldn't fulfill reconcile request.");
            }
            setIsReconciling(false);
        };

        if (isReconciling) {
            doFetch();
        }

        if (isDone) {
            onCompleted();
        }
    }, [isReconciling, onCompleted, reconcileUrl, isDone]);

    return (
        <Dialog
            titleProps={{ text: "Confirm reconciliation" }}
            footerButtonProps={[
                {
                    text: "Cancel",
                    onClick: onCancel,
                },
                {
                    text: "Reconcile",
                    onClick: () => setIsReconciling(true),
                    primary: true,
                    disabled: isReconciling,
                },
            ]}
            onDismiss={onCancel}
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
