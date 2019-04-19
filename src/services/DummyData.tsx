import { IExtensionDocument, IProjectRule, IReleaseReport, IBuildReport, IRepositoryReport } from "./IAzDoService";

export const DummyProjectRulesReport: IExtensionDocument<IProjectRule> = {
    date: new Date(),
    token: "asdf",
    reports: [
        {
            description: "No one should be able to delete the Team Project",
            status: true,
            reconcileUrl: ''
        },
        {
            description: "Some rule that cannot autofix",
            status: false,
            reconcileUrl: ''
        },
        {
            description: "Just some dummy other rule",
            status: false,
            reconcileUrl: 'https://azdoanalyticsdev.azurewebsites.net/api/reconcile/raboweb-test/GitDemo/globalpermissions/NobodyCanDeleteTheTeamProject'
        }
    ]
};

export const DummyBuildReport: IExtensionDocument<IBuildReport> = {
    date: new Date(),
    token: undefined,
    reports: [{
        id: '1234',
        pipeline: 'auto-lst',
        createdDate: "2019-02-12T11:34:18.8188815Z",
        artifactsStoredSecure: true,
        usesFortify: false,
        usesSonarQube: true
    },
    {
        id: '2435',
        pipeline: 'auto-lst',
        createdDate: "2019-01-12T11:34:18.8188815Z",
        artifactsStoredSecure: true,
        usesFortify: false,
        usesSonarQube: true
    }]
};

export const DummyReleaseReport: IExtensionDocument<IReleaseReport> = {
    date: new Date(),
    token: undefined,
    reports: [
        {
            release: "Release-200",
            environment: "raboweb-test",
            releaseId: "2375",
            createdDate: "2019-02-12T11:39:12.9157118Z",
            usesProductionEndpoints: true,
            hasApprovalOptions: false,
            pipeline: "TAS Azure DevOps Extensions",
            hasBranchFilterForAllArtifacts: true,
            usesManagedAgentsOnly: false,
            allArtifactsAreFromBuild: false
        },
        {
            release: "Release-199",
            environment: "raboweb-test",
            releaseId: "2374",
            createdDate: "2019-02-12T11:34:18.8188815Z",
            usesProductionEndpoints: true,
            hasApprovalOptions: false,
            pipeline: "TAS Azure DevOps Extensions",
            hasBranchFilterForAllArtifacts: false,
            usesManagedAgentsOnly: true,
            allArtifactsAreFromBuild: true
        },
        {
            release: "Release-199",
            environment: "raboweb-test",
            releaseId: "2374",
            createdDate: "2019-02-12T11:34:18.8188815Z",
            usesProductionEndpoints: true,
            hasApprovalOptions: false,
            pipeline: "TAS Azure DevOps Extensions",
            hasBranchFilterForAllArtifacts: false,
            usesManagedAgentsOnly: null,
            allArtifactsAreFromBuild: null
        }
    ]
};

export const DummyRepositoriesReport: IExtensionDocument<IRepositoryReport> = {
    date: new Date(),
    token: undefined,
    reports: [
        {
            "repository": "investment-application-messages",
            "hasRequiredReviewerPolicy": true,
            "date": "2019-02-07T18:30:56.0654773+00:00"
        },
        {
            "repository": "rbo-feature-settings-ked",
            "hasRequiredReviewerPolicy": true,
            "date": "2019-02-07T18:30:56.0654773+00:00"
        }
    ]
};