import * as React from "react";
import { IRepositoriesReport } from "./services/IAzDoService";
import { Page } from "azure-devops-ui/Page";
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
import InfoBlock from "./components/InfoBlock";

interface IRepositoriesProps {}

interface IState {
    isLoading: boolean;
    isRescanning: boolean;
    report: IRepositoriesReport;
    hasReconcilePermission: boolean;
    errorText: string;
}

class Repositories extends React.Component<IRepositoriesProps, IState> {
    constructor(props: IRepositoriesProps) {
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
        trackEvent("[Repositories] Page opened");
        trackPageview();
        await this.getReportdata();
    }

    async getReportdata(): Promise<void> {
        try {
            const report = await GetAzDoReportsFromDocumentStorage<
                IRepositoriesReport
            >("repository");
            const hasReconcilePermission = await HasReconcilePermission(
                report.hasReconcilePermissionUrl
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
            // @ts-ignore
            <Surface background={SurfaceBackground.neutral}>
                <Page className="flex-grow">
                    <CompliancyHeader
                        headerText="Repository compliancy"
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

                    <InfoBlock showMoreInfoText={true} />

                    <div className="page-content page-content-top">
                        {this.state.isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            <MasterDetail
                                title="Repositories"
                                data={this.state.report.reports}
                                hasReconcilePermission={
                                    this.state.hasReconcilePermission
                                }
                            />
                        )}
                    </div>
                </Page>
            </Surface>
        );
    }
}

export default withAITracking(appInsightsReactPlugin, Repositories);
