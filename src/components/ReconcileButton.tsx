import * as React from 'react';
import { Button } from 'azure-devops-ui/Button';

interface IReconcileButtonProps {
    reconcileUrl: string,
    token: string
}

export default class extends React.Component<IReconcileButtonProps, {}> {
    constructor(props: IReconcileButtonProps) {
        super(props);
    }

    render() {
        return ( 
            <Button
                primary={true}
                iconProps = {{ iconName: "TriggerAuto" }}
                onClick={() => { fetch(this.props.reconcileUrl || ''); }} 
                text="Reconcile" disabled={(this.props.reconcileUrl == "")} /> )
    }
}