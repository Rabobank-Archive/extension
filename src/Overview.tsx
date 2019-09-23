import * as React from "react";
import { IOverviewReport } from "./services/IAzDoService";

import { ITableColumn, SimpleTableCell, Table } from "azure-devops-ui/Table";
import {
    ObservableArray,
    ObservableValue
} from "azure-devops-ui/Core/Observable";
import { Page } from "azure-devops-ui/Page";
import { Card } from "azure-devops-ui/Card";
import { IStatusProps, Statuses } from "azure-devops-ui/Status";

import { Link } from "azure-devops-ui/Link";
import MasterDetail from "./components/MasterDetail";
import CompliancyHeader from "./components/CompliancyHeader";
import { Surface, SurfaceBackground } from "azure-devops-ui/Surface";

import "./css/styles.css";
import { GetAzDoReportsFromDocumentStorage } from "./services/AzDoService";
import { HasReconcilePermission } from "./services/CompliancyCheckerService";
import {
    appInsightsReactPlugin,
    trackEvent,
    trackPageview
} from "./services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import ErrorBar from "./components/ErrorBar";
import {
    renderStringWithWhyTooltip,
    renderCheckmark
} from "./components/TableRenderers";
import { onSize } from "./components/TableBehaviors";
import ReconcileButton from "./components/ReconcileButton";
interface ITableItem {
    description: string;
    why: string;
    status: IStatusProps;
    hasReconcilePermission: boolean;
    reconcileUrl: string;
    reconcileImpact: string[];
}
interface IOverviewProps {}

interface IState {
    isLoading: boolean;
    isRescanning: boolean;
    report: IOverviewReport;
    hasReconcilePermission: boolean;
    errorText: string;
}

class Overview extends React.Component<IOverviewProps, IState> {
    private itemProvider = new ObservableArray<ITableItem>();

    constructor(props: IOverviewProps) {
        super(props);
        this.state = {
            isLoading: true,
            isRescanning: false,
            report: {
                date: new Date(),
                rescanUrl: "",
                reports: [],
                hasReconcilePermissionUrl: ""
            },
            hasReconcilePermission: false,
            errorText: ""
        };
    }

    async componentDidMount() {
        trackEvent("[Overview] Page opened");
        trackPageview();
        await this.getReportdata();
    }

    async getReportdata(): Promise<void> {
        try {
            const report = await GetAzDoReportsFromDocumentStorage<
                IOverviewReport
            >("globalpermissions");
            const hasReconcilePermission = await HasReconcilePermission(
                report.hasReconcilePermissionUrl
            );

            this.itemProvider.removeAll();

            this.itemProvider.push(
                ...report.reports[0].rules.map<ITableItem>(x => ({
                    description: x.description,
                    why: x.why,
                    hasReconcilePermission: hasReconcilePermission,
                    reconcileUrl: x.reconcile!.url,
                    reconcileImpact: x.reconcile!.impact,
                    status: x.status ? Statuses.Success : Statuses.Failed
                }))
            );

            this.setState({
                isLoading: false,
                report: report,
                hasReconcilePermission: hasReconcilePermission,
                errorText: ""
            });
        } catch {
            this.setState({
                isLoading: false,
                errorText:
                    "Something went wrong while retrieving report data. Please try again later, or contact TAS if the issue persists."
            });
        }
    }

    render() {
        return (
            <Page>
                <CompliancyHeader
                    headerText="Project compliancy"
                    lastScanDate={this.state.report.date}
                    rescanUrl={this.state.report.rescanUrl}
                    onRescanFinished={async () => {
                        await this.getReportdata();
                    }}
                />
                <ErrorBar
                    message={this.state.errorText}
                    onDismiss={() => this.setState({ errorText: "" })}
                />

                <div className="page-content page-content-top flex-row">
                    <div className="flex-grow">
                        <Card>
                            {this.state.isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                <div>
                                    <Table<ITableItem>
                                        columns={[
                                            {
                                                id: "description",
                                                name: "Description",
                                                renderCell: renderStringWithWhyTooltip,
                                                onSize: onSize,
                                                width: new ObservableValue(450)
                                            },
                                            {
                                                id: "status",
                                                name: "Status",
                                                onSize: onSize,
                                                width: new ObservableValue(75),
                                                renderCell: renderCheckmark
                                            },
                                            {
                                                id: "reconcileUrl",
                                                name: "",
                                                onSize: onSize,
                                                width: new ObservableValue(130),
                                                renderCell(
                                                    _rowIndex: number,
                                                    columnIndex: number,
                                                    tableColumn: ITableColumn<
                                                        ITableItem
                                                    >,
                                                    item: ITableItem
                                                ) {
                                                    let content =
                                                        item.status !==
                                                            Statuses.Success &&
                                                        item.hasReconcilePermission ? (
                                                            <ReconcileButton
                                                                reconcilableItem={
                                                                    item
                                                                }
                                                            />
                                                        ) : (
                                                            ""
                                                        );

                                                    return (
                                                        <SimpleTableCell
                                                            columnIndex={
                                                                columnIndex
                                                            }
                                                            tableColumn={
                                                                tableColumn
                                                            }
                                                            key={
                                                                "col-" +
                                                                columnIndex
                                                            }
                                                            contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
                                                        >
                                                            {content}
                                                        </SimpleTableCell>
                                                    );
                                                }
                                            }
                                        ]}
                                        itemProvider={this.itemProvider}
                                        behaviors={[]}
                                    />
                                </div>
                            )}
                        </Card>
                    </div>
                    <div className="flex-grow">
                        <Card
                            className="card-info card-info-overview"
                            titleProps={{ text: "More information" }}
                        >
                            <div>
                                <p>
                                    We would ❤ getting in touch on how to have a
                                    secure setup that works out for you, so join
                                    us on our{" "}
                                    <Link
                                        href="https://confluence.dev.rabobank.nl/display/MTTAS/Sprint+Review+Menu"
                                        target="_blank"
                                    >
                                        bi-weekly sprint review
                                    </Link>{" "}
                                    @UC-T15!
                                </p>
                                <p>
                                    More information on the effective{" "}
                                    <Link
                                        href="https://confluence.dev.rabobank.nl/display/vsts/Azure+DevOps+Project+group+permissions"
                                        target="_blank"
                                    >
                                        Azure Devops Project group permissions
                                    </Link>{" "}
                                    that are used for the secure setup.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </Page>
        );
    }
}

export default withAITracking(appInsightsReactPlugin, Overview);
