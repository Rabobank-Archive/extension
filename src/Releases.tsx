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
import "./Releases.css";
import { GetAzDoReportsFromDocumentStorage } from "./services/AzDoService";
import {
    appInsightsReactPlugin,
    trackEvent,
    trackPageview
} from "./services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import ErrorBar from "./components/ErrorBar";
import InfoBlock from "./components/InfoBlock";

interface ITableItem extends ISimpleTableCell {
    pipeline: string;
    release: string;
    environment: string;
    createdDate: string;
    hasApprovalOptions: IStatusProps;
    hasBranchFilterForAllArtifacts: IStatusProps;
    usesManagedAgentsOnly: IStatusProps;
    allArtifactsAreFromBuild: IStatusProps;
    relatedToSm9Change: IStatusProps;
}

interface IReleaseProps {}

class Releases extends React.Component<
    IReleaseProps,
    { report: IReleaseReport; isLoading: boolean; errorText: string }
> {
    private itemProvider = new ObservableArray<any>();

    constructor(props: IReleaseProps) {
        super(props);
        this.state = {
            report: {
                reports: []
            },
            isLoading: true,
            errorText: ""
        };
    }

    async componentDidMount() {
        trackEvent("[Releases] Page opened");
        trackPageview();

        try {
            const report = await GetAzDoReportsFromDocumentStorage<
                IReleaseReport
            >("Releases");
            this.itemProvider.push(
                ...report.reports.map<ITableItem>(x => ({
                    pipeline: x.pipeline,
                    release: x.release,
                    environment: x.environment,
                    createdDate: x.createdDate,
                    hasApprovalOptions: getStatus(x.hasApprovalOptions),
                    hasBranchFilterForAllArtifacts: getStatus(
                        x.hasBranchFilterForAllArtifacts
                    ),
                    usesManagedAgentsOnly: getStatus(x.usesManagedAgentsOnly),
                    allArtifactsAreFromBuild: getStatus(
                        x.allArtifactsAreFromBuild
                    ),
                    relatedToSm9Change: getStatus(x.relatedToSm9Change)
                }))
            );

            this.setState({ isLoading: false, report: report, errorText: "" });
        } catch (e) {
            if (e.status === 404) {
                this.setState({
                    isLoading: false
                });
            } else {
                this.setState({
                    isLoading: false,
                    errorText:
                        "Something went wrong while retrieving report data. Please try again later, or contact TAS if the issue persists."
                });
            }
        }
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
                width: new ObservableValue(172),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "relatedToSm9Change",
                name: "Related to SM9",
                onSize: onSize,
                renderCell: renderCheckmark,
                className: "center",
                width: new ObservableValue(130),
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

                <ErrorBar
                    message={this.state.errorText}
                    onDismiss={() => this.setState({ errorText: "" })}
                />

                <div className="page-content page-content-top">
                    <InfoBlock />
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
function getStatus(value: null | undefined | boolean): IStatusProps {
    return value === null || value === undefined
        ? Statuses.Queued
        : value
        ? Statuses.Success
        : Statuses.Failed;
}
