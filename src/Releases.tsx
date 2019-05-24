import * as React from "react";
import { IReleaseReport } from "./services/IAzDoService";
import {
    ISimpleTableCell,
    ITableColumn,
    renderSimpleCell,
    Table
} from "azure-devops-ui/Table";
import { IStatusProps, Statuses } from "azure-devops-ui/Status";
import {
    ObservableArray,
    ObservableValue
} from "azure-devops-ui/Core/Observable";
import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { sortingBehavior, onSize } from "./components/TableBehaviors";
import { renderDate, renderCheckmark } from "./components/TableRenderers";
import { Link } from "azure-devops-ui/Link";
import "./Releases.css";
import { GetAzDoReportsFromDocumentStorage } from "./services/AzDoService";
import { appInsightsReactPlugin } from "./services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";

interface ITableItem extends ISimpleTableCell {
    pipeline: string;
    release: string;
    environment: string;
    createdDate: string;
    usesProductionEndpoints: string;
    hasApprovalOptions: IStatusProps;
    hasBranchFilterForAllArtifacts: IStatusProps;
    usesManagedAgentsOnly: IStatusProps;
    allArtifactsAreFromBuild: IStatusProps;
}

interface IReleaseProps {}

class Releases extends React.Component<
    IReleaseProps,
    { report: IReleaseReport; isLoading: boolean }
> {
    private itemProvider = new ObservableArray<any>();

    constructor(props: IReleaseProps) {
        super(props);
        this.state = {
            report: {
                reports: []
            },
            isLoading: true
        };
    }

    async componentDidMount() {
        const report = await GetAzDoReportsFromDocumentStorage<IReleaseReport>(
            "Releases"
        );
        this.itemProvider.push(
            ...report.reports.map<ITableItem>(x => ({
                pipeline: x.pipeline,
                release: x.release,
                environment: x.environment,
                createdDate: x.createdDate,
                usesProductionEndpoints: x.usesProductionEndpoints
                    ? "yes"
                    : "no",
                hasApprovalOptions: x.hasApprovalOptions
                    ? Statuses.Success
                    : Statuses.Failed,
                hasBranchFilterForAllArtifacts: x.hasBranchFilterForAllArtifacts
                    ? Statuses.Success
                    : Statuses.Failed,
                usesManagedAgentsOnly: x.usesManagedAgentsOnly
                    ? Statuses.Success
                    : Statuses.Failed,
                allArtifactsAreFromBuild: x.allArtifactsAreFromBuild
                    ? Statuses.Success
                    : Statuses.Failed
            }))
        );

        this.setState({ isLoading: false, report: report });
    }

    render() {
        const columns: ITableColumn<ITableItem>[] = [
            {
                id: "pipeline",
                name: "Pipeline",
                onSize: onSize,
                renderCell: renderSimpleCell,
                width: -3,
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "release",
                name: "Release",
                onSize: onSize,
                renderCell: renderSimpleCell,
                width: -2,
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "environment",
                name: "Environment",
                onSize: onSize,
                renderCell: renderSimpleCell,
                width: -2,
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "createdDate",
                name: "Created",
                onSize: onSize,
                width: -2,
                renderCell: renderDate,
                sortProps: {
                    ariaLabelAscending: "Sorted Oldest to Newest",
                    ariaLabelDescending: "Sorted Newest to Oldest"
                }
            },
            {
                id: "usesProductionEndpoints",
                name: "Uses production endpoints",
                onSize: onSize,
                renderCell: renderSimpleCell,
                className: "center",
                width: new ObservableValue(185),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "hasApprovalOptions",
                name: "Approved",
                onSize: onSize,
                renderCell: renderCheckmark,
                className: "center",
                width: new ObservableValue(85),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "hasBranchFilterForAllArtifacts",
                name: "Has branch filters",
                onSize: onSize,
                renderCell: renderCheckmark,
                className: "center",
                width: new ObservableValue(130),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "usesManagedAgentsOnly",
                name: "Uses managed agents",
                onSize: onSize,
                renderCell: renderCheckmark,
                className: "center",
                width: new ObservableValue(160),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "allArtifactsAreFromBuild",
                name: "Artifacts are from build",
                onSize: onSize,
                renderCell: renderCheckmark,
                className: "center",
                width: new ObservableValue(250),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            }
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
                    <p>
                        We would ❤ getting in touch on how to improve
                        distinguishing production endpoints, so join us on our{" "}
                        <Link
                            href="https://confluence.dev.rabobank.nl/display/MTTAS/Sprint+Review+Menu"
                            target="_blank"
                        >
                            sprint review
                        </Link>{" "}
                        @UC-T15!
                    </p>
                    <p>
                        More information on the{" "}
                        <Link
                            href="https://confluence.dev.rabobank.nl/pages/viewpage.action?pageId=119243814#ApplyDevOpsSecurityBlueprintCI/CDprinciples-Release"
                            target="_blank"
                        >
                            how &amp; why
                        </Link>{" "}
                        of manual approvals and securing service endpoints with
                        Azure Pipelines or{" "}
                        <Link
                            href="https://confluence.dev.rabobank.nl/display/MTTAS/Secure+Pipelines"
                            target="_blank"
                        >
                            secure pipelines
                        </Link>{" "}
                        in general.
                    </p>
                    <p>
                        If you still have questions or need assistance on your
                        pipelines, create a{" "}
                        <Link
                            href="http://tools.rabobank.nl/vsts/request"
                            target="_blank"
                        >
                            support request
                        </Link>
                        .
                    </p>

                    <Card>
                        {this.state.isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            <Table<ITableItem>
                                columns={columns}
                                itemProvider={this.itemProvider}
                                behaviors={[
                                    sortingBehavior(this.itemProvider, columns)
                                ]}
                            />
                        )}
                    </Card>
                </div>
            </Page>
        );
    }
}

export default withAITracking(appInsightsReactPlugin, Releases);
