import * as React from "react";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { Link } from "azure-devops-ui/Link";
import { appInsightsReactPlugin } from "../services/ApplicationInsights";
import LegendBlock from "./LegendBlock";

interface IInfoBlockProps {
    showMoreInfoText: boolean;
}

const InfoBlock = ({ showMoreInfoText }: IInfoBlockProps) => {
    return (
        <div className="page-content">
            <div className="flex-row">
                <div className="flex-start margin-8">
                    This page is maintained by{" "}
                    <i>'Rabobank Test &amp; Automation Support (TAS)'</i>. It
                    can help you with making your CI/CD pipelines compliant with
                    the{" "}
                    <Link
                        href="https://confluence.dev.rabobank.nl/x/JoQbBw"
                        target="_blank"
                    >
                        DevOps security blueprint policy
                    </Link>
                    . For more information about the AzDo compliance tools you
                    can visit the{" "}
                    <Link
                        href="https://confluence.dev.rabobank.nl/x/2GflCw"
                        target="_blank"
                    >
                        AzDo Compliance
                    </Link>{" "}
                    page.{" "}
                    {showMoreInfoText &&
                        "If you require information about any specific controls you can click on the information icon next to the rule."}{" "}
                    Should you have any remaining questions or need for support,
                    please go to the TAS portal at{" "}
                    <Link
                        href="https://tools.rabobank.nl/vsts/request"
                        target="_blank"
                    >
                        tools.rabobank.nl
                    </Link>
                    .
                </div>
                <div className="flex-end">
                    <LegendBlock></LegendBlock>
                </div>
            </div>
        </div>
    );
};

export default withAITracking(appInsightsReactPlugin, InfoBlock);
