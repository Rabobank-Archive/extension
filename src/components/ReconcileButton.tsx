import * as React from 'react';
import { Button } from 'azure-devops-ui/Button';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { Observer } from "azure-devops-ui/Observer";
import { Dialog } from "azure-devops-ui/Dialog";

interface IReconcileButtonProps {
    reconcilableItem: {
        reconcileUrl: string,
        token: string
    }
}

export default class extends React.Component<IReconcileButtonProps, { }> {
    private isDialogOpen = new ObservableValue<boolean>(false);
    
    constructor(props: IReconcileButtonProps) {
        super(props);
    }

    private async doReconcileRequest(): Promise<Response> {
        return await fetch(this.props.reconcilableItem.reconcileUrl, { headers: { Authorization: `Bearer ${this.props.reconcilableItem.token}` }});
    }

    render () {
        const onDismiss = () => {
            this.isDialogOpen.value = false;
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
                        return props.isDialogOpen ? (
                            <Dialog
                                titleProps={{ text: "Confirm reconciliation" }}
                                footerButtonProps={[
                                    {
                                        text: "Cancel",
                                        onClick: () => {
                                            this.isDialogOpen.value = false;
                                        }
                                    },
                                    { 
                                        text: "Reconcile",
                                        onClick: () => {
                                            this.isDialogOpen.value = false;
                                            this.doReconcileRequest();
                                        },
                                        primary: true 
                                    }
                                ]}
                                onDismiss={onDismiss}
                            >
                                Are you sure?
                            </Dialog>
                        ) : null;
                    }}
                </Observer>
            </div>
        );
    };
}