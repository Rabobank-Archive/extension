import React from "react";
import { storiesOf } from "@storybook/react";
import { NumberedList } from "./NumberedList";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

storiesOf("NumberedList", module).add("default", () => (
    <NumberedList
        itemProvider={new ArrayItemProvider(["Item 1", "Item 2", "Item 3"])}
    />
));
