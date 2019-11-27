import React from "react";
import { storiesOf } from "@storybook/react";
import CiIdentifierPillGroup from "./CiIdentifierPillGroup";

storiesOf("CiIdentifierPillGroup", module).add("default", () => (
    <CiIdentifierPillGroup ciIdentifiers={"CI12345,CI423121"} />
));
