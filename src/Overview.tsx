import * as React from "react";
import { IOverviewReport } from "./services/IAzDoService";
import { ITableColumn, SimpleTableCell, Table } from "azure-devops-ui/Table";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { IStatusProps, Statuses } from "azure-devops-ui/Status";
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
import {
    renderStringWithWhyTooltip,
    renderCheckmark
} from "./components/TableRenderers";
import { onSize } from "./components/TableBehaviors";
import ReconcileButton from "./components/ReconcileButton";
import InfoBlock from "./components/InfoBlock";
import { SurfaceBackground, Surface } from "azure-devops-ui/Surface";
import { getDevopsUiStatus } from "./services/Status";
import { useEffect, useState, useReducer } from "react";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

interface ITableItem {
    description: string;
    link: string | null;
    status: IStatusProps;
    hasReconcilePermission: boolean;
    reconcileUrl: string;
    reconcileImpact: string[];
}

const Overview = () => {
    const [data, setData] = useState<IOverviewReport>({
        date: new Date(),
        hasReconcilePermissionUrl: "",
        rescanUrl: "",
        reports: [
            {
                item: "",
                itemId: "",
                projectId: "",
                rules: []
            }
        ]
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [reload, forceReload] = useReducer(x => x + 1, 0); // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    const [hasReconcilePermission, setHasReconcilePermission] = useState<
        boolean
    >(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        trackEvent("[Overview] Page opened");
        trackPageview();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const report = await GetAzDoReportsFromDocumentStorage<
                    IOverviewReport
                >("globalpermissions");
                const hasReconcilePermission = await HasReconcilePermission(
                    report.hasReconcilePermissionUrl
                );

                setHasReconcilePermission(hasReconcilePermission);
                setData(report);
                setError("");
            } catch (e) {
                if (e.status !== 404) {
                    setError(
                        "Something went wrong while retrieving report data. Please try again later, or contact TAS if the issue persists."
                    );
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [reload]);

    const columns = [
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
                tableColumn: ITableColumn<ITableItem>,
                item: ITableItem
            ) {
                let content =
                    item.status === Statuses.Failed &&
                    item.hasReconcilePermission ? (
                        <ReconcileButton
                            reconcileDisabled={false}
                            reconcilableItem={item}
                        />
                    ) : (
                        ""
                    );

                return (
                    <SimpleTableCell
                        columnIndex={columnIndex}
                        tableColumn={tableColumn}
                        key={"col-" + columnIndex}
                        contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
                    >
                        {content}
                    </SimpleTableCell>
                );
            }
        }
    ];

    const itemProvider = new ArrayItemProvider(
        data.reports[0].rules.map<ITableItem>(x => ({
            description: x.description,
            link: x.link,
            hasReconcilePermission: hasReconcilePermission,
            reconcileUrl: x.reconcile!.url,
            reconcileImpact: x.reconcile!.impact,
            status: getDevopsUiStatus(x.status)
        }))
    );

    return (
        // @ts-ignore
        <Surface background={SurfaceBackground.neutral}>
            <Page className="flex-grow">
                <CompliancyHeader
                    headerText="Project compliancy"
                    lastScanDate={data.date}
                    rescanUrl={data.rescanUrl}
                    onRescanFinished={async () => {
                        forceReload();
                    }}
                />

                <ErrorBar message={error} onDismiss={() => setError("")} />
                <InfoBlock showMoreInfoText={true} />
                <div className="page-content page-content-top">
                    <Card>
                        {loading ? (
                            <div className="page-content">Loading...</div>
                        ) : (
                            <Table<ITableItem>
                                columns={columns}
                                itemProvider={itemProvider}
                            />
                        )}
                    </Card>
                </div>
            </Page>
        </Surface>
    );
};

export default withAITracking(appInsightsReactPlugin, Overview);
