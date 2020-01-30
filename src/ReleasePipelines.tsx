import * as React from "react";
import { IReleasePipelinesReport } from "./services/IAzDoService";
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
import { useState, useEffect, useReducer } from "react";

const ReleasePipelines = () => {
    const [data, setData] = useState<IReleasePipelinesReport>({
        date: new Date(),
        hasReconcilePermissionUrl: "",
        rescanUrl: "",
        reports: []
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [reload, forceReload] = useReducer(x => x + 1, 0); // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    const [hasReconcilePermission, setHasReconcilePermission] = useState<
        boolean
    >(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const report = await GetAzDoReportsFromDocumentStorage<
                    IReleasePipelinesReport
                >("releasepipelines");
                const hasReconcilePermission = await HasReconcilePermission(
                    report.hasReconcilePermissionUrl
                );

                setHasReconcilePermission(hasReconcilePermission);
                setData(report);
                setError("");
            } catch {
                setError(
                    "Something went wrong while retrieving report data. Please try again later, or contact TAS if the issue persists."
                );
            }
            setLoading(false);
        };
        fetchData();
    }, [reload]);

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
                    lastScanDate={data.date}
                    rescanUrl={data.rescanUrl}
                    onRescanFinished={async () => {
                        forceReload({});
                    }}
                />

                <ErrorBar message={error} onDismiss={() => setError("")} />
                <InfoBlock showMoreInfoText={true} />
                <div className="page-content-top full-size">
                    {loading ? (
                        <div className="page-content">Loading...</div>
                    ) : (
                        <MasterDetail
                            title="Pipelines"
                            hasReconcilePermission={hasReconcilePermission}
                            data={data.reports}
                        />
                    )}
                </div>
            </Page>
        </Surface>
    );
};

export default withAITracking(appInsightsReactPlugin, ReleasePipelines);
