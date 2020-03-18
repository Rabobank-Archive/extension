import * as React from "react";
import {
    CustomHeader,
    HeaderIcon,
    TitleSize,
    HeaderTitleArea,
    HeaderTitleRow,
    HeaderTitle,
    HeaderDescription
} from "azure-devops-ui/Header";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { Ago } from "azure-devops-ui/Ago";
import { AgoFormat } from "azure-devops-ui/Utilities/Date";
import { HeaderCommandBar } from "azure-devops-ui/HeaderCommandBar";
import { DoRescanRequest } from "../services/CompliancyCheckerService";
import { appInsightsReactPlugin } from "../services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import ErrorBar from "./ErrorBar";
import { useState } from "react";

const CompliancyHeader = ({
    headerText,
    lastScanDate,
    rescanUrl,
    onRescanFinished
}: {
    headerText: string;
    lastScanDate?: Date;
    rescanUrl?: string;
    onRescanFinished?: () => Promise<void>;
}) => {
    const [isRescanning, setIsRescanning] = useState(false);
    const [errorText, setErrorText] = useState("");

    const doRescanRequest = async (): Promise<void> => {
        setIsRescanning(true);
        await DoRescanRequest(
            rescanUrl!,
            () => {
                setIsRescanning(false);
                setErrorText("");
            },
            () => {
                setIsRescanning(false);
                setErrorText(
                    "Something went wrong while rescanning your project. Please try again later, or contact TAS if the issue persists."
                );
            }
        );
        if (onRescanFinished) await onRescanFinished();
    };

    return (
        <div>
            <CustomHeader className="bolt-header-with-commandbar margin-right-16">
                <HeaderIcon
                    className="bolt-table-status-icon-large"
                    iconProps={{ iconName: "OpenSource" }}
                    // @ts-ignore
                    titleSize={TitleSize.Large}
                />
                <HeaderTitleArea>
                    <HeaderTitleRow>
                        <HeaderTitle
                            className="text-ellipsis"
                            // @ts-ignore
                            titleSize={TitleSize.Large}
                        >
                            {headerText}
                        </HeaderTitle>
                    </HeaderTitleRow>
                    <HeaderDescription>
                        <div className="flex-row">
                            {isRescanning ? (
                                <div>
                                    <Status
                                        {...Statuses.Running}
                                        key="scanning"
                                        // @ts-ignore
                                        size={StatusSize.l}
                                        text="Scanning..."
                                    />
                                </div>
                            ) : lastScanDate ? (
                                <div data-testid="scan-label">
                                    Last scanned:{" "}
                                    <Ago
                                        date={lastScanDate}
                                        // @ts-ignore
                                        format={AgoFormat.Extended}
                                    />
                                </div>
                            ) : (
                                <div>&nbsp;</div>
                            )}
                            <div className="flex-grow" />
                        </div>
                    </HeaderDescription>
                </HeaderTitleArea>
                <HeaderCommandBar
                    items={[
                        {
                            iconProps: { iconName: "TriggerAuto" },
                            id: "rescan",
                            important: true,
                            disabled: isRescanning || rescanUrl === undefined,
                            isPrimary: true,
                            onActivate: () => {
                                doRescanRequest();
                            },
                            text: "Rescan"
                        }
                    ]}
                />
            </CustomHeader>
            <ErrorBar message={errorText} onDismiss={() => setErrorText("")} />
        </div>
    );
};

export default withAITracking(appInsightsReactPlugin, CompliancyHeader);
