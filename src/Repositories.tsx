import * as React from "react";
import { IRepositoriesReport } from "./services/IAzDoService";
import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
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

interface IRepositoriesProps {}

interface IState {
    isLoading: boolean;
    isRescanning: boolean;
    report: IRepositoriesReport;
    hasReconcilePermission: boolean;
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
            hasReconcilePermission: false
        };
    }

    async componentDidMount() {
        trackEvent("[Repositories] Page opened");
        trackPageview();
        await this.getReportdata();
    }

    async getReportdata(): Promise<void> {
        const report = await GetAzDoReportsFromDocumentStorage<
            IRepositoriesReport
        >("repository");
        const hasReconcilePermission = await HasReconcilePermission(
            report.hasReconcilePermissionUrl
        );

        this.setState({
            isLoading: false,
            report: report,
            hasReconcilePermission: hasReconcilePermission
        });
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

                    <div className="page-content page-content-top flex-row">
                        <div className="flex-grow">
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
                        <div className="flex-grow">
                            <Card
                                className="card-info"
                                titleProps={{ text: "More information" }}
                            >
                                <div>
                                    <p>
                                        We would ❤ getting in touch on the pull
                                        request workflow, so join us on our{" "}
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
                                        of branching policies with Azure Repos
                                        or{" "}
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
                                        assistance on your repositories, create
                                        a{" "}
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
}

export default withAITracking(appInsightsReactPlugin, Repositories);
