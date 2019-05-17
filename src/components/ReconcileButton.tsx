import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "azure-devops-ui/Button";
import { Dialog } from "azure-devops-ui/Dialog";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { SimpleList } from "azure-devops-ui/List";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { ICompliancyCheckerService } from "../services/ICompliancyCheckerService";

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
    const [hasError, setHasError] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");
    const [isReconciling, setIsReconciling] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        const doFetch = async () => {
            try {
                await reconcilableItem.compliancyCheckerService.DoReconcileRequest(
                    reconcilableItem.reconcileUrl
                );
                setHasError(false);
                setIsDialogOpen(false);
            } catch (e) {
                setHasError(true);
                setErrorText("Couldn't fulfill reconcile request.");
            }
            setIsReconciling(false);
        };

        if (isReconciling) {
            doFetch();
        }
    }, [
        isReconciling,
        reconcilableItem.compliancyCheckerService,
        reconcilableItem.reconcileUrl
    ]);

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
                <Dialog
                    titleProps={{ text: "Confirm reconciliation" }}
                    footerButtonProps={[
                        {
                            text: "Cancel",
                            onClick: () => {
                                setIsDialogOpen(false);
                                setHasError(false);
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
                        setIsDialogOpen(false);
                        setHasError(false);
                    }}
                >
                    {hasError && (
                        <MessageCard
                            // @ts-ignore
                            severity={MessageCardSeverity.Error}
                            onDismiss={() => {
                                setHasError(false);
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
                    <p>
                        Are you sure? Reconciling will make the following
                        changes:
                    </p>
                    <SimpleList
                        width={"100%"}
                        itemProvider={
                            new ArrayItemProvider<string>(
                                reconcilableItem.reconcileImpact
                            )
                        }
                    />
                </Dialog>
            )}
        </div>
    );
};

export default ReconcileButton;
