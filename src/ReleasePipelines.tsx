import * as React from "react";
import {
    IBuildPipelinesReport,
    IItemReport,
    IReleasePipelinesReport
} from "./services/IAzDoService";
import { Page } from "azure-devops-ui/Page";
import { Link } from "azure-devops-ui/Link";
import { Card } from "azure-devops-ui/Card";
import { SurfaceBackground, Surface } from "azure-devops-ui/Surface";
import MasterDetail from "./components/MasterDetail";
import CompliancyHeader from "./components/CompliancyHeader";
import "./css/styles.css";
import { GetAzDoReportsFromDocumentStorage } from "./services/AzDoService";
import { HasReconcilePermission } from "./services/CompliancyCheckerService";
import { appInsightsReactPlugin } from "./services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";

interface IReleasePipelinesProps {}

interface IState {
    isLoading: boolean;
    isRescanning: boolean;
    releasePipelinesReport: IBuildPipelinesReport;
    hasReconcilePermission: boolean;
}

class ReleasePipelines extends React.Component<IReleasePipelinesProps, IState> {
    constructor(props: IReleasePipelinesProps) {
        super(props);

        this.state = {
            releasePipelinesReport: {
                date: new Date(),
                hasReconcilePermissionUrl: "",
                rescanUrl: "",
                reports: []
            },
            isLoading: true,
            isRescanning: false,
            hasReconcilePermission: false
        };
    }

    private async getData(): Promise<void> {
        const releasePipelinesReport = await GetAzDoReportsFromDocumentStorage<
            IReleasePipelinesReport
        >("releasepipelines");
        const hasReconcilePermission = await HasReconcilePermission(
            releasePipelinesReport.hasReconcilePermissionUrl
        );

        this.setState({
            isLoading: false,
            releasePipelinesReport: releasePipelinesReport,
            hasReconcilePermission: hasReconcilePermission
        });
    }

    async componentDidMount() {
        await this.getData();
    }

    render() {
        return (
            // @ts-ignore
            <Surface background={SurfaceBackground.neutral}>
                <Page className="flex-grow">
                    <CompliancyHeader
                        headerText="Release pipeline compliancy"
                        lastScanDate={this.state.releasePipelinesReport.date}
                        rescanUrl={this.state.releasePipelinesReport.rescanUrl}
                        onRescanFinished={async () => {
                            await this.getData();
                        }}
                    />

                    <div className="page-content page-content-top flex-row">
                        <div className="flex-grow">
                            {this.state.isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                this.getTabContent()
                            )}
                        </div>
                        <div className="flex-grow">
                            <Card
                                className="card-info"
                                titleProps={{ text: "More information" }}
                            >
                                <div>
                                    <p>
                                        We would ❤ getting in touch on the
                                        pipeline setup, so join us on our{" "}
                                        <Link
                                            href="https://confluence.dev.rabobank.nl/display/MTTAS/Sprint+Review+Menu"
                                            target="_blank"
                                        >
                                            {" "}
                                            sprint review
                                        </Link>{" "}
                                        @UC-T15!
                                    </p>

                                    <p>
                                        More information on the{" "}
                                        <Link
                                            href="https://confluence.dev.rabobank.nl/pages/viewpage.action?pageId=119243814#ApplyDevOpsSecurityBlueprintCI/CDprinciples-Repositories"
                                            target="_blank"
                                        >
                                            how &amp; why
                                        </Link>{" "}
                                        of the pipeline setup with Azure
                                        Pipelines or{" "}
                                        <Link
                                            href="https://confluence.dev.rabobank.nl/display/MTTAS/Secure+Pipelines"
                                            target="_blank"
                                        >
                                            secure pipelines
                                        </Link>{" "}
                                        in general.
                                    </p>

                                    <p>
                                        If you still have questions or need
                                        assistance on your pipelines, create a{" "}
                                        <Link
                                            href="http://tools.rabobank.nl/vsts/request"
                                            target="_blank"
                                        >
                                            support request
                                        </Link>
                                        .
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </Page>
            </Surface>
        );
    }

    getTabContent(): React.ReactNode {
        return (
            <MasterDetail
                title="Pipelines"
                hasReconcilePermission={this.state.hasReconcilePermission}
                data={this.state.releasePipelinesReport.reports.sort(
                    compareItemReports
                )}
            />
        );
    }
}

export default withAITracking(appInsightsReactPlugin, ReleasePipelines);

function compareItemReports(a: IItemReport, b: IItemReport) {
    return a.item.localeCompare(b.item);
}
