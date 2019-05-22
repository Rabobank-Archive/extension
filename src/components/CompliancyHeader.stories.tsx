import React from "react";
import { storiesOf } from "@storybook/react";
import CompliancyHeader from "./CompliancyHeader";

storiesOf("CompliancyHeader", module).add("default", () => (
    <CompliancyHeader
        headerText="Mock Headertext"
        lastScanDate={new Date(0)}
        onRescanFinished={() => Promise.resolve()}
        rescanUrl="mock rescanurl"
    />
));
