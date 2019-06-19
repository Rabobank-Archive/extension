import React from "react";
import ReconcileButton from "./ReconcileButton";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { fireEvent, render, wait } from "react-testing-library";

let mock = new MockAdapter(axios);

describe("ReconcileButon", () => {
    it("should reconcile", async () => {
        const { debug, getByText, getAllByText, findByText } = render(
            <ReconcileButton
                reconcilableItem={{
                    reconcileUrl: "/mock-url",
                    reconcileImpact: ["mock-impact"]
                }}
            />
        );

        fireEvent.click(getByText("Reconcile"));

        mock.onGet("*").reply(200);
        
        getByText("Confirm reconciliation");

        const reconcileButtons = getAllByText("Reconcile");
        expect(reconcileButtons).toHaveLength(2);
        const dialogConfirmButton = reconcileButtons[1];
        fireEvent.click(dialogConfirmButton);

        wait(() => {
            expect(findByText("Confirm reconciliation")).toBeNull();
        });
    });

    it("should show a loading state while reconciling", async () => {
        const {
            debug,
            getByText,
            getAllByText,
            findByText,
            container
        } = render(
            <ReconcileButton
                reconcilableItem={{
                    reconcileUrl: "/mock-url",
                    reconcileImpact: ["mock-impact"]
                }}
            />
        );

        fireEvent.click(getByText("Reconcile"));

        const reconcileButtons = getAllByText("Reconcile");
        expect(reconcileButtons).toHaveLength(2);

        mock.onGet("*").reply(200);

        const dialogConfirmButton = reconcileButtons[1];
        fireEvent.click(dialogConfirmButton);

        wait(() => {
            getByText("Reconciling...");
        });
    });

    it("should show an error when reconciling failed", async () => {
        const {
            debug,
            getByText,
            getAllByText,
            findByText,
            container
        } = render(
            <ReconcileButton
                reconcilableItem={{
                    reconcileUrl: "/mock-url",
                    reconcileImpact: ["mock-impact"]
                }}
            />
        );

        fireEvent.click(getByText("Reconcile"));

        mock.onGet("*").reply(500);

        const reconcileButtons = getAllByText("Reconcile");
        expect(reconcileButtons).toHaveLength(2);
        const dialogConfirmButton = reconcileButtons[1];
        fireEvent.click(dialogConfirmButton);

        wait(() => {
            getByText("Couldn't fulfill reconcile request.");
        });
    });

    it("should dismiss the dialog", async () => {
        const {
            debug,
            getByText,
            getAllByText,
            findByText,
            container
        } = render(
            <ReconcileButton
                reconcilableItem={{
                    reconcileUrl: "/mock-url",
                    reconcileImpact: ["mock-impact"]
                }}
            />
        );

        fireEvent.click(getByText("Reconcile"));

        getByText("Confirm reconciliation");

        fireEvent.click(getByText("Cancel"));

        wait(() => {
            expect(findByText("Confirm reconciliation")).toBeNull();
        });
    });
});
