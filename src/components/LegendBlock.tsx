import * as React from "react";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { Card } from "azure-devops-ui/Card";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { appInsightsReactPlugin } from "../services/ApplicationInsights";

const LegendBlock = () => {
    return (
        <Card>
            <div className="flex-grow">
                <Header
                    title={"Legend"}
                    // @ts-ignore
                    titleSize={TitleSize.Small}
                    className="no-v-padding"
                />
                <div className="flex-row margin-4">
                    <Status
                        {...Statuses.Success}
                        className="icon-large-margin"
                        // @ts-ignore
                        size={StatusSize.m}
                    />
                    Success
                </div>
                <div className="flex-row margin-4">
                    <Status
                        {...Statuses.Failed}
                        className="icon-large-margin"
                        // @ts-ignore
                        size={StatusSize.m}
                    />
                    Failed
                </div>
                <div className="flex-row margin-4">
                    <Status
                        {...Statuses.Queued}
                        className="icon-large-margin"
                        // @ts-ignore
                        size={StatusSize.m}
                    />
                    Inconclusive
                </div>
            </div>
        </Card>
    );
};
export default withAITracking(appInsightsReactPlugin, LegendBlock);
