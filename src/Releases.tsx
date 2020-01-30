import * as React from "react";
import { IReleaseReport } from "./services/IAzDoService";
import {
    ISimpleTableCell,
    ITableColumn,
    renderSimpleCell,
    Table
} from "azure-devops-ui/Table";
import { IStatusProps } from "azure-devops-ui/Status";
import {
    ObservableArray,
    ObservableValue
} from "azure-devops-ui/Core/Observable";
import { Card } from "azure-devops-ui/Card";
import { Page } from "azure-devops-ui/Page";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { sortingBehavior, onSize } from "./components/TableBehaviors";
import {
    renderDate,
    renderCheckmark,
    renderLink
} from "./components/TableRenderers";
import "./Releases.css";
import { GetAzDoReportsFromDocumentStorage } from "./services/AzDoService";
import {
    appInsightsReactPlugin,
    trackEvent,
    trackPageview
} from "./services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import ErrorBar from "./components/ErrorBar";
import InfoBlock from "./components/InfoBlock";
import { SurfaceBackground, Surface } from "azure-devops-ui/Surface";
import { getDevopsUiStatus } from "./services/Status";
import { useEffect, useState } from "react";

interface ITableItem extends ISimpleTableCell {
    pipeline: string;
    release: string;
    environment: string;
    createdDate: string;
    hasApprovalOptions: IStatusProps;
    hasBranchFilterForAllArtifacts: IStatusProps;
    usesManagedAgentsOnly: IStatusProps;
    allArtifactsAreFromBuild: IStatusProps;
    sM9ChangeId: string;
    sM9ChangeUrl: string;
}

const Releases = () => {
    const itemProvider = new ObservableArray<ITableItem>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        trackEvent("[Releases] Page opened");
        trackPageview();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const report = await GetAzDoReportsFromDocumentStorage<
                    IReleaseReport
                >("Releases");
                itemProvider.push(
                    ...report.reports.map<ITableItem>(x => ({
                        pipeline: x.pipeline,
                        release: x.release,
                        environment: x.environment,
                        createdDate: x.createdDate,
                        hasApprovalOptions: getDevopsUiStatus(
                            x.hasApprovalOptions
                        ),
                        hasBranchFilterForAllArtifacts: getDevopsUiStatus(
                            x.hasBranchFilterForAllArtifacts
                        ),
                        usesManagedAgentsOnly: getDevopsUiStatus(
                            x.usesManagedAgentsOnly
                        ),
                        allArtifactsAreFromBuild: getDevopsUiStatus(
                            x.allArtifactsAreFromBuild
                        ),
                        sM9ChangeId: x.sM9ChangeId || "-",
                        sM9ChangeUrl: x.sM9ChangeUrl || ""
                    }))
                );

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
    }, [itemProvider]);

    const columns: ITableColumn<ITableItem>[] = [
        {
            id: "pipeline",
            name: "Pipeline",
            onSize: onSize,
            renderCell: renderSimpleCell,
            width: -3,
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        },
        {
            id: "release",
            name: "Release",
            onSize: onSize,
            renderCell: renderSimpleCell,
            width: -2,
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        },
        {
            id: "environment",
            name: "Environment",
            onSize: onSize,
            renderCell: renderSimpleCell,
            width: -2,
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        },
        {
            id: "createdDate",
            name: "Created",
            onSize: onSize,
            width: -2,
            renderCell: renderDate,
            sortProps: {
                ariaLabelAscending: "Sorted Oldest to Newest",
                ariaLabelDescending: "Sorted Newest to Oldest"
            }
        },
        {
            id: "hasApprovalOptions",
            name: "Approved",
            onSize: onSize,
            renderCell: renderCheckmark,
            className: "center",
            width: new ObservableValue(85),
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        },
        {
            id: "hasBranchFilterForAllArtifacts",
            name: "Has branch filters",
            onSize: onSize,
            renderCell: renderCheckmark,
            className: "center",
            width: new ObservableValue(130),
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        },
        {
            id: "usesManagedAgentsOnly",
            name: "Uses managed agents",
            onSize: onSize,
            renderCell: renderCheckmark,
            className: "center",
            width: new ObservableValue(160),
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        },
        {
            id: "allArtifactsAreFromBuild",
            name: "Artifacts are from build",
            onSize: onSize,
            renderCell: renderCheckmark,
            className: "center",
            width: new ObservableValue(172),
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        },
        {
            id: "sM9ChangeId",
            name: "SM9 Change",
            onSize: onSize,
            renderCell: renderLink,
            width: new ObservableValue(130),
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        }
    ];

    return (
        // @ts-ignore
        <Surface background={SurfaceBackground.neutral}>
            <Page className="flex-grow">
                <Header
                    title={"Release compliancy"}
                    // @ts-ignore
                    titleSize={TitleSize.Large}
                    titleIconProps={{ iconName: "OpenSource" }}
                />

                <ErrorBar message={error} onDismiss={() => setError("")} />
                <InfoBlock showMoreInfoText={false} />
                <div className="page-content page-content-top">
                    <Card>
                        {loading ? (
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

export default withAITracking(appInsightsReactPlugin, Releases);
