import * as React from "react";
import {
    IBuildPipelinesReport,
    IItemReport,
    IReleasePipelinesReport
} from "./services/IAzDoService";
import { Page } from "azure-devops-ui/Page";
import { SurfaceBackground, Surface } from "azure-devops-ui/Surface";
import MasterDetail from "./components/MasterDetail";
import CompliancyHeader from "./components/CompliancyHeader";
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
import InfoBlock from "./components/InfoBlock";

interface IReleasePipelinesProps {}

interface IState {
    isLoading: boolean;
    isRescanning: boolean;
    releasePipelinesReport: IBuildPipelinesReport;
    hasReconcilePermission: boolean;
    errorText: string;
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
            hasReconcilePermission: false,
            errorText: ""
        };
    }

    private async getData(): Promise<void> {
        try {
            const releasePipelinesReport = await GetAzDoReportsFromDocumentStorage<
                IReleasePipelinesReport
            >("releasepipelines");
            const hasReconcilePermission = await HasReconcilePermission(
                releasePipelinesReport.hasReconcilePermissionUrl
            );

            this.setState({
                isLoading: false,
                releasePipelinesReport: releasePipelinesReport,
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

    async componentDidMount() {
        trackEvent("[Release Pipelines] Page opened");
        trackPageview();
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

                    <ErrorBar
                        message={this.state.errorText}
                        onDismiss={() => this.setState({ errorText: "" })}
                    />

                    <InfoBlock showMoreInfoText={true} />

                    <div className="page-content page-content-top">
                        {this.state.isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            this.getTabContent()
                        )}
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
