import React from "react";

import { render, waitFor } from "@testing-library/react";

import ConfirmReconcileDialog from "./ConfirmReconcileDialog";
import userEvent from "@testing-library/user-event";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

let mock = new MockAdapter(axios);

describe("ConfirmReconcileDialog", () => {
    it("should render the dialog", async () => {
        const { findByText } = render(
            <ConfirmReconcileDialog
                impact={[
                    "Dummy Project Administrators group is created and added to Project Administrators",
                    "Delete team project permissions of the Dummy Project Administrators group is set to deny",
                    "Members of the Project Administrators are moved to Dummy Project Administrators",
                    "Delete team project permission is set to 'not set' for all other groups",
                ]}
                reconcileUrl={"Mock url"}
                onCompleted={() => {}}
                onCancel={() => {}}
            />
        );

        expect(
            await findByText(
                "Delete team project permissions of the Dummy Project Administrators group is set to deny"
            )
        ).toBeDefined();

        const btn = (await findByText("Reconcile")).closest("button");
        expect(btn).toBeDefined();
        expect(!btn!.hasAttribute("disabled"));
    });

    it("should show an error", async () => {
        mock.onPost(/\/mock-url/).reply(500);

        const { getByText } = render(
            <ConfirmReconcileDialog
                impact={[]}
                reconcileUrl={"/mock-url"}
                onCompleted={() => {}}
                onCancel={() => {}}
            />
        );

        const btn = getByText("Reconcile").closest("button");
        expect(btn).toBeDefined();
        userEvent.click(btn!);

        await waitFor(() => getByText("Couldn't fulfill reconcile request."), {
            timeout: 3500,
        });
    });
});
