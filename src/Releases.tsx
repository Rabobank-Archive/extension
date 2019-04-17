import * as React from 'react';
import moment from 'moment';
import Checkmark from './components/Checkmark';
import Report from './components/Report';
import { IColumn } from 'office-ui-fabric-react';
import { IAzDoService, IExtensionDocument, IReleaseReport } from './services/IAzDoService';

interface IReleaseProps {
    azDoService: IAzDoService
}

export default class extends React.Component<IReleaseProps, {}> {
    constructor(props: IReleaseProps) {
        super(props);
    }

    render() {
      const columns : IColumn[] = [
          {
            key: 'column1',
            fieldName: 'pipeline',
            name: 'Pipeline',
            minWidth: 250,
            maxWidth: 250,
            isResizable: true
        },
        {
            key: 'column2',
            fieldName: 'release',
            name: 'Release',
            minWidth: 50,
            maxWidth: 150,
            isResizable: true
        },
        {
            key: 'column3',
            fieldName: 'environment',
            name: 'Environment',
            minWidth: 50,
            maxWidth: 150,
            isResizable: true
        },
        {
            key: 'column4',
            fieldName: 'createdDate',
            name: 'Created',
            minWidth: 50,
            maxWidth: 100,
            isResizable: true,
            onRender: (item: IReleaseReport) => <div>{moment(item.createdDate).fromNow()}</div>
        },
        {
            key: 'column6',
            fieldName: 'usesProductionEndpoints',
            name: 'Production Endpoints',
            minWidth: 125,
            maxWidth: 125,
            headerClassName: 'center',
            className: 'center',
            isResizable: true,
            data: Boolean,
            isMultiline: true,
            onRender: (item: IReleaseReport) => <Checkmark checked={item.usesProductionEndpoints} />
        },
        {
            key: 'column5',
            fieldName: 'hasApprovalOptions',
            name: 'Approval',
            minWidth: 50,
            maxWidth: 50,
            headerClassName: 'center',
            className: 'center',
            isResizable: true,
            data: Boolean,
            onRender: (item: IReleaseReport) => <Checkmark checked={item.hasApprovalOptions} />
        },
        {
            key: 'column7',
            fieldName: 'hasBranchFilterForAllArtifacts',
            name: 'Branch Filters',
            minWidth: 100,
            maxWidth: 100,
            headerClassName: 'center',
            className: 'center',
            isResizable: true,
            data: Boolean,
            onRender: (item: IReleaseReport) => <Checkmark checked={item.hasBranchFilterForAllArtifacts} />
        },
        {
            key: 'column8',
            fieldName: 'usesManagedAgentsOnly',
            name: 'Uses Managed Agents',
            minWidth: 125,
            maxWidth: 125,
            headerClassName: 'center',
            className: 'center',
            isResizable: true,
            data: Boolean,
            onRender: (item: IReleaseReport) => <Checkmark checked={item.usesManagedAgentsOnly} />
        },
        {
            key: 'column9',
            fieldName: 'allArtifactsAreFromBuild',
            name: 'Artifacts are from build',
            minWidth: 150,
            maxWidth: 150,
            headerClassName: 'center',
            className: 'center',
            isResizable: true,
            data: Boolean,
            onRender: (item: IReleaseReport) => <Checkmark checked={item.allArtifactsAreFromBuild} />
        }
      ];

      return (<div>
            <div>
                <h1>Release compliancy</h1>
                <p>We would ❤ getting in touch on how to improve distinguishing production endpoints, so join us on our <a href="https://confluence.dev.rabobank.nl/display/MTTAS/Sprint+Review+Menu" target="_blank">sprint review</a> @UC-T15!</p>
                <p>More information on the <a href="https://confluence.dev.rabobank.nl/pages/viewpage.action?pageId=119243814#ApplyDevOpsSecurityBlueprintCI/CDprinciples-Release" target="_blank">how &amp; why</a> of manual approvals and securing service endpoints with Azure Pipelines or <a href="https://confluence.dev.rabobank.nl/display/MTTAS/Secure+Pipelines" target="_blank">secure pipelines</a> in general.</p>
                <p>If you still have questions or need assistance on your pipelines, create a <a href="http://tools.rabobank.nl/vsts/request" target="_blank">support request</a>.</p>
            </div>
            <Report columns={columns} reports={async () => (await this.props.azDoService.GetReportsFromDocumentStorage<IReleaseReport>("Releases")).reports} / >
        </div>);
    }  
}

