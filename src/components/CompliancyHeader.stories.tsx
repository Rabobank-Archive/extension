import React from "react";
import { storiesOf } from "@storybook/react";
import CompliancyHeader from "./CompliancyHeader";
import { CompliancyCheckerService } from "../services/CompliancyCheckerService";

storiesOf("CompliancyHeader", module).add("default", () => (
    <CompliancyHeader
        compliancyCheckerService={new CompliancyCheckerService()}
        headerText="Mock Headertext"
        lastScanDate={new Date(0)}
        onRescanFinished={() => Promise.resolve()}
        rescanUrl="mock rescanurl"
    />
));
