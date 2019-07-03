import React from "react";
import { IReleaseRule } from "./IAzDoService";
import { IsTokenExpired } from "./AzDoService";
import * as SDK from "azure-devops-extension-sdk";

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

    it("should return true if token expired", () => {
        let token =
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1laWQiOiIxNjIwNTQ0NC03ZjY1LTYyMzctODM4Yi00NzNmNjhhOWE3YjMiLCJ0aWQiOiI2ZTkzYTYyNi04YWNhLTRkYzEtOTE5MS1jZTI5MWI0Yjc1YTEiLCJpc3MiOiJhcHAudnNzcHMudmlzdWFsc3R1ZGlvLmNvbSIsImF1ZCI6Ijc4YzY4ZGIxLTIzMjMtNGE0OC04M2Y3LWY0MjA3MGY2ZTYzMiIsIm5iZiI6MTU2MjE1NTUzNSwiZXhwIjoxNTYyMTU5NzM1fQ.syVdJ-WC7JgpOmP9Gs-ULKyER58nNAEc_SdsCCHBNj4";
        var expired = IsTokenExpired(token);
        expect(expired).toBe(true);
    });

    //Token expires Monday 7 may 2035
    it("should return false if token not expired", () => {
        let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1laWQiOiIxNjIwNTQ0NC03ZjY1LTYyMzctODM4Yi00NzNmNjhhOWE3YjMiLCJ0aWQiOiI2ZTkzYTYyNi04YWNhLTRkYzEtOTE5MS1jZTI5MWI0Yjc1YTEiLCJpc3MiOiJhcHAudnNzcHMudmlzdWFsc3R1ZGlvLmNvbSIsImF1ZCI6Ijc4YzY4ZGIxLTIzMjMtNGE0OC04M2Y3LWY0MjA3MGY2ZTYzMiIsIm5iZiI6MTU2MjE1NTUzNSwiZXhwIjoyMDYyMTU5NzM1fQ.40-RT42P8lkKI2igtz2BahQoJO9OnnKC6I3VpCvWY5U";
        var expired = IsTokenExpired(token);
        expect(expired).toBe(false);
    });
});
