import React from "react";
import ReconcileButton from "./ReconcileButton";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
    render,
    waitFor,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let mock = new MockAdapter(axios, { delayResponse: 200 });

describe("ReconcileButton", () => {
    it("should reconcile", async () => {
        mock.onPost(/\/mock-url/).reply(200);

        const { getByText, getAllByText, getByRole } = render(
            <ReconcileButton
                reconcilableItem={{
                    reconcileUrl: "/mock-url",
                    reconcileImpact: ["mock-impact"],
                }}
            />
        );

        userEvent.click(getByRole("button"));
        getByText("Confirm reconciliation");

        const reconcileButtons = getAllByText("Reconcile");
        expect(reconcileButtons).toHaveLength(2);
        const dialogConfirmButton = reconcileButtons[1];

        userEvent.click(dialogConfirmButton);

        await waitForElementToBeRemoved(() => getByText("Reconciling..."), {
            timeout: 500,
        });
    });

    it("should show an error when reconciling failed", async () => {
        mock.onPost(/\/mock-url/).reply(500);
        const { getByRole, getByText, getAllByText, findByText } = render(
            <ReconcileButton
                reconcilableItem={{
                    reconcileUrl: "/mock-url",
                    reconcileImpact: ["mock-impact"],
                }}
            />
        );

        userEvent.click(getByRole("button"));
        getByText("Confirm reconciliation");

        const reconcileButtons = getAllByText("Reconcile");
        expect(reconcileButtons).toHaveLength(2);
        const dialogConfirmButton = reconcileButtons[1];
        userEvent.click(dialogConfirmButton);

        await waitFor(() => {
            findByText("Couldn't fulfill reconcile request.");
        });
    });
});
