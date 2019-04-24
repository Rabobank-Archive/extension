import * as React from 'react';
import { IAzDoService, IRepositoryReport } from './services/IAzDoService';
import { ISimpleTableCell, ITableColumn, renderSimpleCell, Table } from 'azure-devops-ui/Table';
import { IStatusProps, Statuses } from 'azure-devops-ui/Status';
import { ObservableArray, ObservableValue } from 'azure-devops-ui/Core/Observable';
import { Header, TitleSize } from 'azure-devops-ui/Header';
import { Card } from 'azure-devops-ui/Card';
import { Page } from 'azure-devops-ui/Page';
import { sortingBehavior } from './components/TableSortingBehavior';
import { renderCheckmark, renderDate } from './components/TableRenderers';
import { Link } from 'azure-devops-ui/Link';

interface ITableItem extends ISimpleTableCell {
    repository: string,
    hasRequiredReviewerPolicy: IStatusProps,
    date: string
}

interface IRepositoriesProps {
    azDoService: IAzDoService
}

export default class extends React.Component<IRepositoriesProps, { report: IRepositoryReport, isLoading: boolean }> {
    private itemProvider = new ObservableArray<any>();
    
    constructor(props: IRepositoriesProps) {
        super(props);
        this.state = {
            report: {
                reports: []
            },
            isLoading: true
        }
    }

    async componentDidMount() {
        const report = await this.props.azDoService.GetReportsFromDocumentStorage<IRepositoryReport>("GitRepositories");
        this.itemProvider.push(...report.reports.map<ITableItem>(x => ({
            repository: x.repository,
            date: x.date,
            hasRequiredReviewerPolicy: x.hasRequiredReviewerPolicy ? Statuses.Success : Statuses.Failed,
        })));

        this.setState({ isLoading: false, report: report });    
    }

    render() {
        const columns: ITableColumn<ITableItem>[] = [
            {
                id: 'repository',
                name: "Repository",
                renderCell: renderSimpleCell,
                width: new ObservableValue(250),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: 'hasRequiredReviewerPolicy',
                name: "Required Reviewer Policy",
                renderCell: renderCheckmark,
                width: new ObservableValue(100),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: 'date',
                name: "Checked",
                renderCell: renderDate,
                width: new ObservableValue(100),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
        ]

        return (
            <Page>
                <Header
                    title={"Repository compliancy"}
                    titleSize={TitleSize.Medium}
                    titleIconProps={{ iconName: "OpenSource" }}
                />
                <div className="page-content page-content-top">
                    <p>We would ❤ getting in touch on the pull request workflow, so join us on our <Link href="https://confluence.dev.rabobank.nl/display/MTTAS/Sprint+Review+Menu" target="_blank">sprint review</Link> @UC-T15!</p>
                    <p>More information on the <Link href="https://confluence.dev.rabobank.nl/pages/viewpage.action?pageId=119243814#ApplyDevOpsSecurityBlueprintCI/CDprinciples-Repositories" target="_blank">how &amp; why</Link> of branching policies with Azure Repos or <Link href="https://confluence.dev.rabobank.nl/display/MTTAS/Secure+Pipelines" target="_blank">secure pipelines</Link> in general.</p>
                    <p>If you still have questions or need assistance on your repositories, create a <Link href="http://tools.rabobank.nl/vsts/request" target="_blank">support request</Link>.</p>

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

