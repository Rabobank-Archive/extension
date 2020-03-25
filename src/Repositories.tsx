import * as React from "react";
import { Page } from "azure-devops-ui/Page";
import { SurfaceBackground, Surface } from "azure-devops-ui/Surface";

import MasterDetail from "./components/MasterDetail";
import CompliancyHeader from "./components/CompliancyHeader";

import "./css/styles.css";
import ErrorBar from "./components/ErrorBar";
import { useReconcileReport } from "./hooks/useReconcileReport";

const Repositories = () => {
    const report = useReconcileReport("repository");

    return (
        // @ts-ignore
        <Surface background={SurfaceBackground.neutral}>
            <Page className="flex-grow">
                <CompliancyHeader
                    headerText="Repository compliancy"
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
                <div className="page-content-top full-size">
                    {report.loading || !report.data ? (
                        <div className="page-content">Loading...</div>
                    ) : (
                        <MasterDetail
                            title="Repositories"
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

export default Repositories;
