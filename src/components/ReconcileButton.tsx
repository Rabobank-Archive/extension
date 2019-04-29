import * as React from 'react';
import { Button } from 'azure-devops-ui/Button';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { Observer } from "azure-devops-ui/Observer";
import { Dialog } from "azure-devops-ui/Dialog";
import { MessageCard, MessageCardSeverity } from "azure-devops-ui/MessageCard";
import { SimpleList, ScrollableList, List } from 'azure-devops-ui/List';
import { ArrayItemProvider } from 'azure-devops-ui/Utilities/Provider';
import { Status, Statuses, StatusSize } from 'azure-devops-ui/Status';

interface IReconcileButtonProps {
    reconcilableItem: {
        reconcileUrl: string,
        reconcileImpact: string[],
        token: string
    }
}

interface IReconcileButtonState {
    hasError: boolean,
    errorText: string,
    isReconciling: boolean
}

export default class extends React.Component<IReconcileButtonProps, IReconcileButtonState> {
    private isDialogOpen = new ObservableValue<boolean>(false);
    
    constructor(props: IReconcileButtonProps) {
        super(props);
        this.state = {
            hasError: false,
            errorText: "",
            isReconciling: false
        }
    }

    private async doReconcileRequest(): Promise<void> {
        try {
            let url = this.props.reconcilableItem.reconcileUrl;
            this.setState({ isReconciling: true });
            let requestInit: RequestInit = { headers: { Authorization: `Bearer ${this.props.reconcilableItem.token}` }};
            let response = await fetch(url, requestInit);
            if(response.ok)
            {
                this.isDialogOpen.value = false;
                this.setState({ hasError: false, isReconciling: false });
            } else {
                this.setState({ hasError: true, errorText: "Couldn't fulfill reconcile request.", isReconciling: false });
            }
        } catch {
            this.setState({ hasError: true, errorText: "Couldn't fulfill reconcile request.", isReconciling: false });
        }
    }

    render () {
        const onDismiss = () => {
            this.isDialogOpen.value = false;
            this.setState({ hasError: false })
        };

        return (
            <div>
                <Button
                    primary={true}
                    iconProps = {{ iconName: "TriggerAuto" }}
                    onClick={() => { this.isDialogOpen.value = true; }} 
                    text="Reconcile" disabled={(this.props.reconcilableItem.reconcileUrl == "")} />
                
                <Observer isDialogOpen={this.isDialogOpen}>
                    {(props: { isDialogOpen: boolean }) => {
                        let error = this.state.hasError ?
                            <MessageCard 
                                severity={MessageCardSeverity.Error} 
                                onDismiss={() => {this.setState({hasError: false})}}>
                                {this.state.errorText}
                            </MessageCard> :
                            "";

                        let reconcilingSpinner = this.state.isReconciling ?
                            <Status
                            {...Statuses.Running}
                            key="reconciling"
                            size={StatusSize.xl}
                            text="Reconciling..."
                            /> :
                            "";

                        return props.isDialogOpen ? (
                            <Dialog
                                titleProps={{ text: "Confirm reconciliation" }}
                                footerButtonProps={[
                                    {
                                        text: "Cancel",
                                        onClick: () => {
                                            this.isDialogOpen.value = false;
                                            this.setState({ hasError: false })
                                        }
                                    },
                                    { 
                                        text: "Reconcile",
                                        onClick: () => {
                                            this.doReconcileRequest();
                                        },
                                        primary: true,
                                        disabled: this.state.isReconciling
                                    }
                                ]}
                                onDismiss={onDismiss}
                            >
                                {error}
                                {reconcilingSpinner}
                                <p>Are you sure? Reconciling will make the following changes:</p>
                                <SimpleList width={"100%"} itemProvider={
                                    new ArrayItemProvider<string>(this.props.reconcilableItem.reconcileImpact)}
                                />
                                
                                <MessageCard severity={MessageCardSeverity.Warning} >
                                You need to have "Manage project properties" permissions!
                            </MessageCard>
                            </Dialog>
                        ) : null;
                    }}
                </Observer>
            </div>
        );
    };
}