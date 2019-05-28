import React from "react";
import { storiesOf } from "@storybook/react";
import { CompliancyCheckerService } from "./services/CompliancyCheckerService";
import { DummyAzDoService } from './services/DummyAzDoService';
import Releases from "./Releases";

storiesOf("Releases", module).add("default", () => (
    <Releases azDoService={new DummyAzDoService()}
    />
));
