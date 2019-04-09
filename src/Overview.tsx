import * as React from 'react';
import moment from 'moment';
import Checkmark from './components/Checkmark';
import Report from './components/Report';
import { IColumn, Button } from 'office-ui-fabric-react';

interface IProjectRule {
    description: string,
    status: boolean,
    fixUrl: string | undefined
}
export default class extends React.Component<{}, {}> {
    constructor(props: {}) {
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
            fieldName: 'fix',
            name: '',
            minWidth: 50,
            maxWidth: 50,
            isResizable: true,
            // onRender: (item: IProjectRule) => !item.status ? <Button text="fix" disabled={!item.fixUrl} /> : <span />
        }];

        const dummy: IProjectRule[] = [{
            description: "No one should be able to delete the Team Project",
            status: true,
            fixUrl: undefined
        },
        {
            description: "Some rule that cannot autofix",
            status: false,
            fixUrl: undefined
        },
        {
            description: "Just some dummy other rule",
            status: false,
            fixUrl: 'google.nl'
        }];

        return (
            <div>
                <div>
                    <h1>Project compliancy</h1>
                    <p>For feedback and questions, please contact the TAS team.</p>
                    <p>More information on the <a href="https://confluence.dev.rabobank.nl/display/vsts/Azure+DevOps+Project+group+permissions" target="_blank">Azure Devops Project Group permissions</a> in general.</p>
                </div>
                <Report columns={columns} document="ProjectOverview" dummy={dummy} />
            </div>)
    }
}
