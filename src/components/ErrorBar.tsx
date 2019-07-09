import * as React from "react";
import { IButtonProps } from "azure-devops-ui/Button";
import { appInsightsReactPlugin } from "../services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { MessageCardSeverity, MessageCard } from "azure-devops-ui/MessageCard";

interface IErrorBarProps {
    message: string;
}

const ErrorBar = ({ message }: IErrorBarProps) => {
    const buttonProps: IButtonProps[] = [
        {
            text: "Contact TAS",
            onClick: () => {
                window.open(
                    "https://tools.rabobank.nl/vsts/request?app=vsts",
                    "_blank"
                );
            }
        }
    ];

    return (
        <div>
            {message && (
                <MessageCard
                    buttonProps={buttonProps}
                    className="flex-self-stretch"
                    // @ts-ignore
                    severity={MessageCardSeverity.Error}
                >
                    {message}
                </MessageCard>
            )}
        </div>
    );
};

export default withAITracking(appInsightsReactPlugin, ErrorBar);
