import React from "react";
import { storiesOf } from "@storybook/react";
import { UnorderedList } from "./UnorderedList";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

storiesOf("UnorderedList", module).add("default", () => (
    <UnorderedList
        itemProvider={
            new ArrayItemProvider([
                "Rabobank Project Administrators group is created and added to Project Administrators",
                "Delete team project permissions of the Rabobank Project Administrators group is set to deny",
                "Members of the Project Administrators are moved to Rabobank Project Administrators",
                "Delete team project permission is set to 'not set' for all other groups"
            ])
        }
    />
));
