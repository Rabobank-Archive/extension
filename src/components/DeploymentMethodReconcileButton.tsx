import * as React from "react";
import { FormItem } from "azure-devops-ui/FormItem";
import { TextField } from "azure-devops-ui/TextField";
import { Dropdown } from "azure-devops-ui/Dropdown";
import ReconcileButton from "./ReconcileButton";
import { IEnvironment } from "../services/IAzDoService";
import { useState } from "react";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";

const DeploymentMethodReconcileButton = ({
    reconcilableItem,
    environments
}: {
    reconcilableItem: {
        reconcileUrl: string;
        reconcileImpact: string[];
        name?: string | null | undefined;
    };
    environments?: IEnvironment[];
}) => {
    const [ciIdentifier, setCiIdentifier] = useState<string>("");
    const [environment, setEnvironment] = useState<string>("");
    const regexCiIdentifier: RegExp = /^CI[+ 0-9]{7}$/;
    const isReconcileDisabled =
        !regexCiIdentifier.test(ciIdentifier) || environment.length === 0;

    const resetState = () => {
        setEnvironment("");
        setCiIdentifier("");
    };

    return (
        <ReconcileButton
            reconcileDisabled={isReconcileDisabled}
            data={{ ciIdentifier, environment }}
            reconcilableItem={reconcilableItem}
            onReconcile={resetState}
        >
            <MessageCard
                className="margin-8"
                // @ts-ignore
                severity={MessageCardSeverity.Warning}
            >
                Within ITSM you need to have permission to update the
                Configuration Item. After submitting it can take up to 1 hour
                before the CI identifier is visible in Azure DevOps.
            </MessageCard>
            <FormItem className="margin-8" label="CI Identifier">
                <TextField
                    value={ciIdentifier}
                    onChange={(_, newValue) => setCiIdentifier(newValue)}
                    placeholder="CIxxxxxxx"
                    data-testid="ci-identifier"
                />
            </FormItem>
            <FormItem className="margin-8" label="Production Environment">
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
        </ReconcileButton>
    );
};

export default DeploymentMethodReconcileButton;
