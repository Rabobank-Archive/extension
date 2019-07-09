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

interface ICompliancyHeaderProps {
    headerText: string;
    lastScanDate: Date;
    rescanUrl: string;
    onRescanFinished?: () => Promise<void>;
}

interface IState {
    isRescanning: boolean;
    errorText: string;
}

class CompliancyHeader extends React.Component<ICompliancyHeaderProps, IState> {
    constructor(props: ICompliancyHeaderProps) {
        super(props);
        this.state = {
            isRescanning: false,
            errorText: ""
        };
    }

    private async doRescanRequest(): Promise<void> {
        this.setState({ isRescanning: true });
        await DoRescanRequest(
            this.props.rescanUrl,
            () => {
                this.setState({ isRescanning: false });
            },
            () => {
                this.setState({
                    isRescanning: false,
                    errorText:
                        "Something went wrong while rescanning your project. Please try again later, or contact TAS if the issue persists."
                });
            }
        );
        if (this.props.onRescanFinished) await this.props.onRescanFinished();
    }

    render() {
        return (
            <div>
                <CustomHeader className="bolt-header-with-commandbar">
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
                                {this.props.headerText}
                            </HeaderTitle>
                        </HeaderTitleRow>
                        <HeaderDescription>
                            <div className="flex-row">
                                {this.state.isRescanning ? (
                                    <div>
                                        <Status
                                            {...Statuses.Running}
                                            key="scanning"
                                            // @ts-ignore
                                            size={StatusSize.l}
                                            text="Scanning..."
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        Last scanned:{" "}
                                        <Ago
                                            date={this.props.lastScanDate}
                                            // @ts-ignore
                                            format={AgoFormat.Extended}
                                        />
                                    </div>
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
                                disabled: this.state.isRescanning,
                                isPrimary: true,
                                onActivate: () => {
                                    this.doRescanRequest();
                                },
                                text: "Rescan"
                            }
                        ]}
                    />
                </CustomHeader>
                <ErrorBar message={this.state.errorText} />
            </div>
        );
    }
}

export default withAITracking(appInsightsReactPlugin, CompliancyHeader);
