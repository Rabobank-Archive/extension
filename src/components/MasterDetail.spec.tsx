import React from "react";
import { MasterDetail } from "./MasterDetail";
import { fireEvent, render } from "react-testing-library";
import { DummyRepositoriesReport } from "../services/DummyData";

describe("MasterDetail", () => {
    it("should filter the master list", async () => {
        const { getByLabelText, queryAllByText, queryAllByRole } = render(
            <MasterDetail
                hasReconcilePermission={true}
                title="Mock Title"
                data={DummyRepositoriesReport.reports}
            />
        );

        const visibleMasterItems = queryAllByRole("option");
        expect(visibleMasterItems).toHaveLength(2);

        const searchBox = await getByLabelText("Search...");
        fireEvent.change(searchBox, { target: { value: "rbo" } });

        const filteredItem = queryAllByText("investment-application-messages");
        expect(filteredItem).toHaveLength(0); //Shouldn't be there anymore after filtering on 'rbo'
    });

    it("should filter case insensitive", async () => {
        const { getByLabelText, queryAllByRole } = render(
            <MasterDetail
                hasReconcilePermission={true}
                title="Mock Title"
                data={DummyRepositoriesReport.reports}
            />
        );

        let visibleMasterItems = queryAllByRole("option");
        expect(visibleMasterItems).toHaveLength(2);

        const searchBox = await getByLabelText("Search...");
        fireEvent.change(searchBox, { target: { value: "RBO" } });

        visibleMasterItems = queryAllByRole("option");
        expect(visibleMasterItems).toHaveLength(1);
    });
});
