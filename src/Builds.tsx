import * as React from "react";
import { IBuildReport } from "./services/IAzDoService";
import {
    ISimpleTableCell,
    ITableColumn,
    renderSimpleCell,
    Table
} from "azure-devops-ui/Table";
import { Statuses, IStatusProps } from "azure-devops-ui/Status";
import {
    ObservableArray,
    ObservableValue
} from "azure-devops-ui/Core/Observable";
import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { onSize, sortingBehavior } from "./components/TableBehaviors";
import { renderDate, renderCheckmark } from "./components/TableRenderers";
import {
    appInsightsReactPlugin,
    trackEvent,
    trackPageview
} from "./services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import ErrorBar from "./components/ErrorBar";
import InfoBlock from "./components/InfoBlock";
import { SurfaceBackground, Surface } from "azure-devops-ui/Surface";
import { useEffect } from "react";
import { useOtherReport } from "./hooks/useOtherReport";

interface ITableItem extends ISimpleTableCell {
    pipeline: string;
    buildId: string;
    createdDate: string;
    usesFortify: IStatusProps;
    usesSonarQube: IStatusProps;
    artifactsStoredSecure: IStatusProps;
}

const Builds = () => {
    const report = useOtherReport<IBuildReport>("BuildReports");

    useEffect(() => {
        trackEvent("[Builds] Page opened");
        trackPageview();
    }, []);

    const columns: ITableColumn<ITableItem>[] = [
        {
            id: "pipeline",
            name: "Pipeline",
            onSize: onSize,
            renderCell: renderSimpleCell,
            width: new ObservableValue(450),
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        },
        {
            id: "buildId",
            name: "Build",
            onSize: onSize,
            width: new ObservableValue(100),
            renderCell: renderSimpleCell,
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        },
        {
            id: "createdDate",
            name: "Created",
            onSize: onSize,
            width: new ObservableValue(130),
            renderCell: renderDate,
            sortProps: {
                ariaLabelAscending: "Sorted Oldest to Newest",
                ariaLabelDescending: "Sorted Newest to Oldest"
            }
        },
        {
            id: "usesFortify",
            name: "Fortify",
            onSize: onSize,
            className: "center",
            width: new ObservableValue(90),
            renderCell: renderCheckmark,
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        },
        {
            id: "usesSonarQube",
            name: "SonarQube",
            onSize: onSize,
            className: "center",
            width: new ObservableValue(90),
            renderCell: renderCheckmark,
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        },
        {
            id: "artifactsStoredSecure",
            name: "Artifact Secure",
            onSize: onSize,
            className: "center",
            width: new ObservableValue(120),
            renderCell: renderCheckmark,
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        }
    ];

    const itemProvider = new ObservableArray<ITableItem>(
        report.data?.reports.map<ITableItem>(x => ({
            pipeline: x.pipeline,
            buildId: x.id,
            createdDate: x.createdDate,
            usesFortify: x.usesFortify ? Statuses.Success : Statuses.Failed,
            usesSonarQube: x.usesSonarQube ? Statuses.Success : Statuses.Failed,
            artifactsStoredSecure: x.artifactsStoredSecure
                ? Statuses.Success
                : Statuses.Failed
        }))
    );
    return (
        // @ts-ignore
        <Surface background={SurfaceBackground.neutral}>
            <Page className="flex-grow">
                <Header
                    title={"Build compliancy"}
                    // @ts-ignore
                    titleSize={TitleSize.Large}
                    titleIconProps={{ iconName: "OpenSource" }}
                />

                <ErrorBar
                    message={report.error}
                    onDismiss={() => report.setError("")}
                />
                <InfoBlock showMoreInfoText={false} />
                <div className="page-content page-content-top">
                    <Card>
                        {report.loading ? (
                            <div className="page-content">Loading...</div>
                        ) : (
                            <Table<ITableItem>
                                columns={columns}
                                itemProvider={itemProvider}
                                behaviors={[
                                    sortingBehavior(itemProvider, columns)
                                ]}
                            />
                        )}
                    </Card>
                </div>
            </Page>
        </Surface>
    );
};

export default withAITracking(appInsightsReactPlugin, Builds);
