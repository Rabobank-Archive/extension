import * as React from 'react';
import Checkmark from './components/Checkmark';
import Report from './components/Report';
import { IAzDoService, IProjectRule, IExtensionDocument } from './services/AzDoService'
import { IColumn, Button } from 'office-ui-fabric-react';

interface IOverviewProps {
    azDoService: IAzDoService
}

export default class extends React.Component<IOverviewProps, {}> {
    constructor(props: IOverviewProps) {
        super(props);
    }

    render() {
        const columns: IColumn[] = [{
            key: 'column1',
            fieldName: 'description',
            name: 'Description',
            minWidth: 450,
            maxWidth: 450,
            isResizable: true
        },
        {
            key: 'column2',
            fieldName: 'status',
            name: 'Status',
            minWidth: 50,
            maxWidth: 50,
            isResizable: true,
            onRender: (item: IProjectRule) => <Checkmark checked={item.status} />
        },
        {
            key: 'column3',
            fieldName: 'reconcileUrl',
            name: '',
            minWidth: 75,
            maxWidth: 75,
            isResizable: true,
            onRender: (item: IProjectRule) => !item.status ? <Button onClick={() => { fetch(item.reconcileUrl || ''); item.status = true; }} text="Reconcile" disabled={!item.reconcileUrl} /> : <span />
        }];

        return (
            <div>
                <div>
                    <h1>Project compliancy</h1>
                    <p>We would ❤ getting in touch on how to have a secure setup that works out for you, so join us on our <a href="https://confluence.dev.rabobank.nl/display/MTTAS/Sprint+Review+Menu" target="_blank">bi-weekly sprint review</a> @UC-T15!</p>
                    <p>More information on the effective <a href="https://confluence.dev.rabobank.nl/display/vsts/Azure+DevOps+Project+group+permissions" target="_blank">Azure Devops Project group permissions</a> that are used for the secure setup.</p>
                </div>
                <Report columns={columns} reports={async () => (await this.props.azDoService.GetReportsFromDocumentStorage<IProjectRule>("globalpermissions")).reports} />            
            </div>)
    }
}
