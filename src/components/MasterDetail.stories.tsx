import React from "react";
import { storiesOf } from "@storybook/react";
import MasterDetail from "./MasterDetail";
import { DummyRepositoriesReport } from "../services/DummyData";

storiesOf("MasterDetail", module)
    .add("default", () => (
        <MasterDetail
            hasReconcilePermission={true}
            title="Mock Title"
            data={DummyRepositoriesReport.reports}
        />
    ))
    .add("long list", () => (
        <MasterDetail
            hasReconcilePermission={true}
            title="Mock Title"
            data={Array(35).fill({
                item: "investment-application-messages",
                rules: [
                    {
                        description: "Nobody can delete the repository",
                        why:
                            "To enforce auditability, no data should be deleted. Therefore, nobody should be able to delete the repository.",
                        status: true,
                        reconcile: {
                            url: "http://some-reconcile-url",
                            impact: ["some impact"]
                        }
                    }
                ]
            })}
        />
    ));
