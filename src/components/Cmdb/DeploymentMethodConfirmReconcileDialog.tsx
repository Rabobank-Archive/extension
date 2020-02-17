import React, { useState, useEffect } from "react";
import { Dialog } from "azure-devops-ui/Dialog";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { UnorderedList } from "../UnorderedList";
import { DoReconcileRequest } from "../../services/CompliancyCheckerService";
import {
    appInsightsReactPlugin,
    trackEvent,
    trackException
} from "../../services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import ErrorBar from "../ErrorBar";
import { FormItem } from "azure-devops-ui/FormItem";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { TextField } from "azure-devops-ui/TextField";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { IEnvironment } from "../../services/IAzDoService";
import ReconcileLoader from "../ReconcileLoader";
import { Toggle } from "azure-devops-ui/Toggle";

import "./DeploymentMethodConfirmReconcileDialog.css";

interface IDeploymentMethodConfirmReconcileDialogProps {
    reconcileUrl: string;
    impact: string[];
    onReconcileCompleted?: () => void;
    onCancel?: () => void;
    environments?: IEnvironment[];
}

const DeploymentMethodConfirmReconcileDialog = ({
    impact,
    reconcileUrl,
    onReconcileCompleted,
    onCancel,
    environments
}: IDeploymentMethodConfirmReconcileDialogProps) => {
    const [isReconciling, setIsReconciling] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");
    const [ciIdentifier, setCiIdentifier] = useState<string>("");
    const [environment, setEnvironment] = useState<string>("");
    const [isProd, setIsProd] = useState<boolean>(true);

    const regexCiIdentifier: RegExp = /^CI[+ 0-9]{7}$/;
    const isReconcileDisabled =
        (isProd &&
            (!regexCiIdentifier.test(ciIdentifier) ||
                environment.length === 0)) ||
        isReconciling;

    useEffect(() => {
        trackEvent("[Confirm Deployment Method Reconcile Dialog] Opened");
    }, []);

    useEffect(() => {
        if (!isProd) {
            setEnvironment("");
            setCiIdentifier("");
        }
    }, [isProd]);

    useEffect(() => {
        const reconcile = async () => {
            try {
                setErrorText("");
                const data = isProd
                    ? {
                          ciIdentifier,
                          environment
                      }
                    : {};
                await DoReconcileRequest(reconcileUrl, data);

                trackEvent(
                    "[Confirm Deployment Method Reconcile Dialog] Reconcile completed"
                );
                if (onReconcileCompleted) onReconcileCompleted();
            } catch (e) {
                setErrorText(
                    `Reconcile failed. You do not have permission to update the CI-identifier. Click on the link below for information. `
                );
                setIsReconciling(false);
                trackException(e);
            }
        };

        if (isReconciling) {
            reconcile();
        }
    }, [
        isReconciling,
        onReconcileCompleted,
        reconcileUrl,
        ciIdentifier,
        environment,
        isProd
    ]);

    return (
        <Dialog
            titleProps={{ text: "Confirm reconciliation" }}
            footerButtonProps={[
                {
                    text: "Cancel",
                    onClick: () => {
                        setErrorText("");
                        trackEvent(
                            "[Confirm Deployment Method Reconcile Dialog] Cancelled"
                        );
                        if (onCancel) onCancel();
                    }
                },
                {
                    text: "Reconcile",
                    onClick: () => {
                        setIsReconciling(true);
                        trackEvent(
                            "[Confirm Deployment Method Reconcile Dialog] Confirmed"
                        );
                    },
                    primary: true,
                    disabled: isReconcileDisabled
                }
            ]}
            onDismiss={() => {
                setErrorText("");
            }}
        >
            <ErrorBar
                message={errorText}
                onDismiss={() => setErrorText("")}
                linkProps={{
                    text: "Go to Confluence",
                    link:
                        "https://confluence.dev.rabobank.nl/x/PqKbD#ReleasepipelinehasvalidCMDBlink-Permissions"
                }}
            />
            {isReconciling && <ReconcileLoader />}
            <p>Are you sure? Reconciling will make the following changes:</p>
            <UnorderedList
                itemProvider={new ArrayItemProvider<string>(impact)}
            />
            <MessageCard
                className="margin-8"
                // @ts-ignore
                severity={MessageCardSeverity.Warning}
            >
                Within ITSM you need to have permission to update the
                Configuration Item. After submitting it can take up to 1 hour
                before the CI identifier is visible in Azure DevOps.
            </MessageCard>
            <FormItem className="margin-8" label="Production pipeline?">
                <Toggle
                    offText={"No"}
                    onText={"Yes"}
                    checked={isProd}
                    onChange={(_, value) => setIsProd(value)}
                />
            </FormItem>
            <FormItem className="margin-8" label="CI identifier">
                <TextField
                    value={ciIdentifier}
                    onChange={(_, newValue) => setCiIdentifier(newValue)}
                    placeholder="CIxxxxxxx"
                    data-testid="ci-identifier"
                    disabled={!isProd}
                />
            </FormItem>
            <FormItem className="margin-8" label="Production stage">
                <Dropdown
                    data-testid="environment-dropdown"
                    placeholder="Select the production stage"
                    items={
                        environments
                            ? environments.map(e => ({
                                  id: e.id,
                                  text: e.name
                              }))
                            : []
                    }
                    onSelect={(_, item) => setEnvironment(item.id)}
                    disabled={!isProd}
                />
            </FormItem>
        </Dialog>
    );
};

export default withAITracking(
    appInsightsReactPlugin,
    DeploymentMethodConfirmReconcileDialog
);
