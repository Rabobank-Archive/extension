import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "azure-devops-ui/Dialog";
import {
    appInsightsReactPlugin,
    trackEvent
} from "../services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { IEnvironment } from "../services/IAzDoService";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { FormItem } from "azure-devops-ui/FormItem";
import JSONPretty from "react-json-pretty";
import * as clipboard from "clipboard-polyfill";

interface IConfirmDeploymentMethodDialogProps {
    onReconcileCompleted: () => void;
    onCancel: () => void;
    environments?: IEnvironment[];
    projectId: string;
    itemId: string;
}

const ConfirmDeploymentMethodDialog = ({
    environments,
    onCancel,
    onReconcileCompleted,
    projectId,
    itemId
}: IConfirmDeploymentMethodDialogProps) => {
    const [, setErrorText] = useState<string>("");
    const [environment, setEnvironment] = useState<string | null>(null);
    const [copy, setCopy] = useState<boolean>(false);
    const jsonRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        trackEvent("[Confirm Reconcile Dialog] Opened");
    }, []);

    useEffect(() => {
        const copyJsonToClipboard = async () => {
            if (jsonRef && jsonRef.current) {
                await clipboard.writeText(jsonRef.current.value);
                setCopy(false);
                onReconcileCompleted();
            }
        };

        if (copy) {
            copyJsonToClipboard();
        }
    }, [copy, projectId, itemId, environment, onReconcileCompleted]);

    const json = `{ "organization": "raboweb", "project": "${projectId}", "pipeline": "${itemId}", "stage": "${environment}" }`;

    const showJson = environment != null;

    const cancelButton = {
        text: "Cancel",
        onClick: () => {
            setErrorText("");
            trackEvent("[Confirm Deployment Method Dialog] Cancelled");
            onCancel();
        }
    };

    const copyButton = {
        text: "Copy",
        iconProps: {
            iconName: "Copy"
        },
        onClick: () => {
            setCopy(true);
            trackEvent("[Confirm Deployment Method Dialog] JSON Copied");
        },
        primary: true,
        disabled: !showJson
    };

    return (
        <Dialog
            titleProps={{ text: "Create Deployment Method" }}
            footerButtonProps={[cancelButton, copyButton]}
            onDismiss={() => {
                setErrorText("");
            }}
        >
            <p className="no-padding no-margin">
                To change the deployment method you should:
            </p>
            <ul className="margin-16">
                <li>- Select the production environment from the dropdown</li>
                <li>- Copy the generated JSON</li>
                <li>- Add a Deployment Method in SM9</li>
                <li>- Paste the JSON in the Supplementary Information field</li>
            </ul>

            <FormItem label="Production Environment">
                <Dropdown
                    data-testid="environment-dropdown"
                    placeholder="Select the production environment"
                    items={
                        environments
                            ? environments.map(e => ({
                                  id: e.id,
                                  text: e.name
                              }))
                            : []
                    }
                    onSelect={(_, item) => setEnvironment(item.id)}
                />
            </FormItem>
            {showJson && <JSONPretty data={json}></JSONPretty>}
            <textarea
                ref={jsonRef}
                className="hidden"
                value={json}
                readOnly={true}
            ></textarea>
        </Dialog>
    );
};

export default withAITracking(
    appInsightsReactPlugin,
    ConfirmDeploymentMethodDialog
);
