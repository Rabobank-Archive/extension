import * as React from "react";
import { appInsightsReactPlugin } from "../services/ApplicationInsights";
import { withAITracking } from "@microsoft/applicationinsights-react-js";
import { Link } from "azure-devops-ui/Link";

const InfoBlock = () => {
    return (
        <p>
            This page is maintained by the Test &amp; Automation Support
            department. You can use it to verify if you are working in
            accordance with the{" "}
            <Link
                href="https://confluence.dev.rabobank.nl/x/JoQbBw"
                target="_blank"
            >
                current blueprint policies
            </Link>
            . For information about specific controls you can click on the
            information icon next to the rule. If you have any questions please
            contact us at{" "}
            <Link href="https://tools.rabobank.nl/vsts/request" target="_blank">
                tools.rabobank.nl
            </Link>
            .
        </p>
    );
};

export default withAITracking(appInsightsReactPlugin, InfoBlock);
