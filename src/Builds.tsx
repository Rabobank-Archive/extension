import * as React from "react";

import {
    ITableColumn,
    ISimpleTableCell,
    renderSimpleCell,
    Table
} from "azure-devops-ui/Table";
import {
    ObservableValue,
    ObservableArray
} from "azure-devops-ui/Core/Observable";
import { Page } from "azure-devops-ui/Page";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { Card } from "azure-devops-ui/Card";
import { Statuses, IStatusProps } from "azure-devops-ui/Status";

import { IBuildReport } from "./services/IAzDoService";
import { sortingBehavior, onSize } from "./components/TableBehaviors";
import { renderDate, renderCheckmark } from "./components/TableRenderers";
import { Link } from "azure-devops-ui/Link";
import { GetAzDoReportsFromDocumentStorage } from "./services/AzDoService";
import {
    appInsightsReactPlugin,
    trackEvent,
    trackPageview
} from "./services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import ErrorBar from "./components/ErrorBar";

interface ITableItem extends ISimpleTableCell {
    pipeline: string;
    buildId: string;
    createdDate: string;
    usesFortify: IStatusProps;
    usesSonarQube: IStatusProps;
    artifactsStoredSecure: IStatusProps;
}

interface IBuildProps {}

class Builds extends React.Component<
    IBuildProps,
    { report: IBuildReport; isLoading: boolean; errorText: string }
> {
    private itemProvider = new ObservableArray<any>();

    constructor(props: IBuildProps) {
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
        trackEvent("[Builds] Page opened");
        trackPageview();

        try {
            const report = await GetAzDoReportsFromDocumentStorage<
                IBuildReport
            >("BuildReports");
            this.itemProvider.push(
                ...report.reports.map<ITableItem>(x => ({
                    pipeline: x.pipeline,
                    buildId: x.id,
                    createdDate: x.createdDate,
                    usesFortify: x.usesFortify
                        ? Statuses.Success
                        : Statuses.Failed,
                    usesSonarQube: x.usesSonarQube
                        ? Statuses.Success
                        : Statuses.Failed,
                    artifactsStoredSecure: x.artifactsStoredSecure
                        ? Statuses.Success
                        : Statuses.Failed
                }))
            );

            this.setState({ isLoading: false, report: report, errorText: "" });
        } catch {
            this.setState({
                isLoading: false,
                errorText:
                    "Something went wrong while retrieving report data. Please try again later, or contact TAS if the issue persists."
            });
        }
    }

    render() {
        const columns: ITableColumn<ITableItem>[] = [
            {
                id: "pipeline",
                name: "Pipeline",
                onSize: onSize,
                renderCell: renderSimpleCell,
                width: new ObservableValue(450),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "buildId",
                name: "Build",
                onSize: onSize,
                width: new ObservableValue(100),
                renderCell: renderSimpleCell,
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "createdDate",
                name: "Created",
                onSize: onSize,
                width: new ObservableValue(130),
                renderCell: renderDate,
                sortProps: {
                    ariaLabelAscending: "Sorted Oldest to Newest",
                    ariaLabelDescending: "Sorted Newest to Oldest"
                }
            },
            {
                id: "usesFortify",
                name: "Fortify",
                onSize: onSize,
                className: "center",
                width: new ObservableValue(90),
                renderCell: renderCheckmark,
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "usesSonarQube",
                name: "SonarQube",
                onSize: onSize,
                className: "center",
                width: new ObservableValue(90),
                renderCell: renderCheckmark,
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "artifactsStoredSecure",
                name: "Artifact Secure",
                onSize: onSize,
                className: "center",
                width: new ObservableValue(120),
                renderCell: renderCheckmark,
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            }
        ];

        return (
            <Page>
                <Header
                    title={"Build compliancy"}
                    // @ts-ignore
                    titleSize={TitleSize.Medium}
                    titleIconProps={{ iconName: "OpenSource" }}
                />

                <ErrorBar
                    message={this.state.errorText}
                    onDismiss={() => this.setState({ errorText: "" })}
                />
                <div className="page-content page-content-top">
                    <p>
                        We would ❤ getting in touch on how to improve analyzing
                        builds and stuff, so join us on our{" "}
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
                            href="https://confluence.dev.rabobank.nl/pages/viewpage.action?pageId=119243814#ApplyDevOpsSecurityBlueprintCI/CDprinciples-Build"
                            target="_blank"
                        >
                            how &amp; why
                        </Link>{" "}
                        of storing artifacts secure with Azure Pipelines or{" "}
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

export default withAITracking(appInsightsReactPlugin, Builds);
