import React from "react";
import { IReleaseRule } from "./IAzDoService";

describe("AzDoService", () => {
    it("should return undefined if property not present in report", () => {
        let objectWithoutProperty: any = {
            project: "TAS",
            release: "Release-2",
            environment: "UAT",
            releaseId: "2897",
            createdDate: "/Date(1553253609389)/",
            usesProductionEndpoints: false,
            hasApprovalOptions: false,
            pipeline: "Operations IT Global List",
            hasBranchFilterForAllArtifacts: false,
            allArtifactsAreFromBuild: null,
            usesManagedAgentsOnly: null
        };

        let castedObject = objectWithoutProperty as IReleaseRule;
        expect(castedObject.relatedToSm9Change).toBe(undefined);
    });
});
