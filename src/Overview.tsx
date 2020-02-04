import * as React from "react";
import { ITableColumn, SimpleTableCell, Table } from "azure-devops-ui/Table";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { IStatusProps, Statuses } from "azure-devops-ui/Status";
import CompliancyHeader from "./components/CompliancyHeader";

import "./css/styles.css";
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
import { useEffect } from "react";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { useReconcileReport } from "./hooks/useReconcileReport";

interface ITableItem {
    description: string;
    link: string | null;
    status: IStatusProps;
    hasReconcilePermission: boolean;
    reconcileUrl: string;
    reconcileImpact: string[];
}

const Overview = () => {
    const report = useReconcileReport("globalpermissions");

    useEffect(() => {
        trackEvent("[Overview] Page opened");
        trackPageview();
    }, []);

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
                        <ReconcileButton reconcilableItem={item} />
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
        report.data?.reports[0].rules.map<ITableItem>(x => ({
            description: x.description,
            link: x.link,
            hasReconcilePermission: report.hasReconcilePermission,
            reconcileUrl: x.reconcile!.url,
            reconcileImpact: x.reconcile!.impact,
            status: getDevopsUiStatus(x.status)
        })) || []
    );

    return (
        // @ts-ignore
        <Surface background={SurfaceBackground.neutral}>
            <Page className="flex-grow">
                <CompliancyHeader
                    headerText="Project compliancy"
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
                <div className="page-content page-content-top">
                    <Card>
                        {report.loading ? (
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
