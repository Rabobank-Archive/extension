import * as React from 'react';
import moment from 'moment';
import Checkmark from './components/Checkmark';
import Report from './components/Report';
import { IAzDoService, IRepositoryReport, IExtensionDocument } from './services/IAzDoService';
import { IColumn } from 'office-ui-fabric-react';

interface IRepositoriesProps {
    azDoService: IAzDoService
}

export default class extends React.Component<IRepositoriesProps, {}> {
    constructor(props: IRepositoriesProps) {
        super(props);
    }

    render() {
        const columns: IColumn[] = [{
            key: 'column1',
            fieldName: 'repository',
            name: 'Repository',
            minWidth: 250,
            maxWidth: 250,
            isResizable: true,
        },
        {
            key: 'column2',
            fieldName: 'hasRequiredReviewerPolicy',
            name: 'Required Reviewer Policy',
            minWidth: 50,
            maxWidth: 200,
            isResizable: true,
            data: Boolean,
            onRender: (item: IRepositoryReport) => <Checkmark checked={item.hasRequiredReviewerPolicy} />
        },
        {
            key: 'column3',
            fieldName: 'date',
            name: 'Checked',
            minWidth: 100,
            isResizable: true,
            onRender: (item: IRepositoryReport) => <div>{moment(item.date).fromNow()}</div>
        }];

        return (
            <div>
                <div>
                    <h1>Compliancy</h1>
                    <p>We would ❤ getting in touch on the pull request workflow, so join us on our <a href="https://confluence.dev.rabobank.nl/display/MTTAS/Sprint+Review+Menu" target="_blank">sprint review</a> @UC-T15!</p>
                    <p>More information on the <a href="https://confluence.dev.rabobank.nl/pages/viewpage.action?pageId=119243814#ApplyDevOpsSecurityBlueprintCI/CDprinciples-Repositories" target="_blank">how &amp; why</a> of branching policies with Azure Repos or <a href="https://confluence.dev.rabobank.nl/display/MTTAS/Secure+Pipelines" target="_blank">secure pipelines</a> in general.</p>
                    <p>If you still have questions or need assistance on your repositories, create a <a href="http://tools.rabobank.nl/vsts/request" target="_blank">support request</a>.</p>
                </div>
                <hr />
                <Report columns={columns} reports={async () => (await this.props.azDoService.GetReportsFromDocumentStorage<IExtensionDocument<IRepositoryReport>>("GitRepositories")).reports} />
            </div>)
    }
}

