import * as React from "react";
import { Page } from "azure-devops-ui/Page";
import { SurfaceBackground, Surface } from "azure-devops-ui/Surface";

import MasterDetail from "./components/MasterDetail";
import CompliancyHeader from "./components/CompliancyHeader";

import "./css/styles.css";
import {
    appInsightsReactPlugin,
    trackEvent,
    trackPageview
} from "./services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import ErrorBar from "./components/ErrorBar";
import InfoBlock from "./components/InfoBlock";
import { useEffect } from "react";
import { useReconcileReport } from "./hooks/useReconcileReport";

const ReleasePipelines = () => {
    const report = useReconcileReport("releasepipelines");

    useEffect(() => {
        trackEvent("[Release Pipelines] Page opened");
        trackPageview();
    }, []);

    return (
        // @ts-ignore
        <Surface background={SurfaceBackground.neutral}>
            <Page className="flex-grow">
                <CompliancyHeader
                    headerText="Release pipeline compliancy"
                    lastScanDate={report.data?.date}
                    rescanUrl={report.data?.rescanUrl}
                    onRescanFinished={async () => {
                        report.forceReload();
                    }}
                />

                <ErrorBar
                    message={report.error}
                    onDismiss={() => report.setError("")}
                />
                <InfoBlock showMoreInfoText={true} />
                <div className="page-content-top full-size">
                    {report.loading || !report.data ? (
                        <div className="page-content">Loading...</div>
                    ) : (
                        <MasterDetail
                            title="Pipelines"
                            hasReconcilePermission={
                                report.hasReconcilePermission
                            }
                            data={report.data.reports}
                        />
                    )}
                </div>
            </Page>
        </Surface>
    );
};

export default withAITracking(appInsightsReactPlugin, ReleasePipelines);
