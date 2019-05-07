import * as React from 'react';
import { IAzDoService, IReleaseReport } from './services/IAzDoService';
import { ISimpleTableCell, ITableColumn, renderSimpleCell, Table } from 'azure-devops-ui/Table';
import { IStatusProps, Statuses } from 'azure-devops-ui/Status';
import { ObservableArray, ObservableValue } from 'azure-devops-ui/Core/Observable';
import { Card } from 'azure-devops-ui/Card';
import { Page } from 'azure-devops-ui/Page';
import { Header, TitleSize } from 'azure-devops-ui/Header';
import { sortingBehavior, onSize } from './components/TableBehaviors';
import { renderDate, renderCheckmark } from './components/TableRenderers';
import { Link } from 'azure-devops-ui/Link';

interface ITableItem extends ISimpleTableCell {
    pipeline: string,
    release: string,
    environment: string,
    createdDate: string,
    usesProductionEndpoints: IStatusProps,
    hasApprovalOptions: IStatusProps,
    hasBranchFilterForAllArtifacts: IStatusProps,
    usesManagedAgentsOnly: IStatusProps,
    allArtifactsAreFromBuild: IStatusProps
}

interface IReleaseProps {
    azDoService: IAzDoService
}

export default class extends React.Component<IReleaseProps, {report: IReleaseReport, isLoading: boolean}> {
    private itemProvider = new ObservableArray<any>();
    
    constructor(props: IReleaseProps) {
        super(props);
        this.state = {
            report: {
                reports: []
            },
            isLoading: true
        }
    }

    async componentDidMount() {
        const report = await this.props.azDoService.GetReportsFromDocumentStorage<IReleaseReport>("Releases");
        this.itemProvider.push(...report.reports.map<ITableItem>(x => ({
             pipeline: x.pipeline,
             release: x.release,
             environment: x.environment,
             createdDate: x.createdDate,
             usesProductionEndpoints: x.usesProductionEndpoints ? Statuses.Success : Statuses.Failed,
             hasApprovalOptions: x.hasApprovalOptions ? Statuses.Success : Statuses.Failed,
             hasBranchFilterForAllArtifacts: x.hasBranchFilterForAllArtifacts ? Statuses.Success : Statuses.Failed,
             usesManagedAgentsOnly: x.usesManagedAgentsOnly ? Statuses.Success : Statuses.Failed,
             allArtifactsAreFromBuild: x.allArtifactsAreFromBuild ? Statuses.Success : Statuses.Failed
        })));

        this.setState({ isLoading: false, report: report });    
    }

    render() {
        const columns: ITableColumn<ITableItem>[] = [
            {
                id: 'pipeline',
                name: 'Pipeline',
                onSize: onSize,
                renderCell: renderSimpleCell,
                width: new ObservableValue(250),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: 'release',
                name: "Release",
                onSize: onSize,
                renderCell: renderSimpleCell,
                width: new ObservableValue(150),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: 'environment',
                name: "Environment",
                onSize: onSize,
                renderCell: renderSimpleCell,
                width: new ObservableValue(150),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: 'createdDate',
                name: 'Created',
                onSize: onSize,
                width: new ObservableValue(100),
                renderCell: renderDate,
                sortProps: {
                    ariaLabelAscending: "Sorted Oldest to Newest",
                    ariaLabelDescending: "Sorted Newest to Oldest"
                }
            },
            {
                id: 'usesProductionEndpoints',
                name: 'Production Endpoints',
                onSize: onSize,
                renderCell: renderCheckmark,
                width: new ObservableValue(150),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: 'hasApprovalOptions',
                name: 'Approval',
                onSize: onSize,
                renderCell: renderCheckmark,
                width: new ObservableValue(80),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: 'hasBranchFilterForAllArtifacts',
                name: 'Branch Filters',
                onSize: onSize,
                renderCell: renderCheckmark,
                width: new ObservableValue(100),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: 'usesManagedAgentsOnly',
                name: 'Uses Managed Agents',
                onSize: onSize,
                renderCell: renderCheckmark,
                width: new ObservableValue(150),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: 'allArtifactsAreFromBuild',
                name: 'Artifacts are from build',
                onSize: onSize,
                renderCell: renderCheckmark,
                width: new ObservableValue(250),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },      
      ];

      return (
            <Page>
                <Header
                    title={"Release compliancy"}
                    // @ts-ignore
                    titleSize={TitleSize.Medium}
                    titleIconProps={{ iconName: "OpenSource" }}
                />

            <div className="page-content page-content-top">
                <p>We would ❤ getting in touch on how to improve distinguishing production endpoints, so join us on our <Link href="https://confluence.dev.rabobank.nl/display/MTTAS/Sprint+Review+Menu" target="_blank">sprint review</Link> @UC-T15!</p>
                <p>More information on the <Link href="https://confluence.dev.rabobank.nl/pages/viewpage.action?pageId=119243814#ApplyDevOpsSecurityBlueprintCI/CDprinciples-Release" target="_blank">how &amp; why</Link> of manual approvals and securing service endpoints with Azure Pipelines or <Link href="https://confluence.dev.rabobank.nl/display/MTTAS/Secure+Pipelines" target="_blank">secure pipelines</Link> in general.</p>
                <p>If you still have questions or need assistance on your pipelines, create a <Link href="http://tools.rabobank.nl/vsts/request" target="_blank">support request</Link>.</p>
 
                <Card>
                { this.state.isLoading ?
                            <div>Loading...</div> :
                            <Table<ITableItem> columns={columns}  itemProvider={this.itemProvider} behaviors={[ sortingBehavior(this.itemProvider, columns) ]} />
                        }
                    </Card>
                </div>
            </Page>

            );
    }  
}