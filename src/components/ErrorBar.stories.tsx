import React from "react";
import { storiesOf } from "@storybook/react";
import ErrorBar from "./ErrorBar";

storiesOf("ErrorBar", module).add("default", () => (
    <ErrorBar message="Some error message" />
));
