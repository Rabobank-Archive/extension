import React from "react";
import { storiesOf } from "@storybook/react";
import ReconcileButton from "./ReconcileButton";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

let mock = new MockAdapter(axios, { delayResponse: 5000 });

const button = (
    <ReconcileButton
        reconcilableItem={{
            reconcileUrl: "/mock-url",
            reconcileImpact: [
                "Dummy Project Administrators group is created and added to Project Administrators",
                "Delete team project permissions of the Dummy Project Administrators group is set to deny",
                "Members of the Project Administrators are moved to Dummy Project Administrators",
                "Delete team project permission is set to 'not set' for all other groups",
            ],
        }}
    />
);
storiesOf("ReconcileButton", module)
    .add("default", () => {
        mock.onPost(/\/mock-url/).reply(200);
        return button;
    })
    .add("error", () => {
        mock.onPost(/\/mock-url/).reply(500);
        return button;
    });
