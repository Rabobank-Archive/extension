import { IExtensionDocument, IProjectRule, IReleaseReport, IBuildReport, IRepositoryReport, IOverviewReport } from './IAzDoService';

export const DummyProjectRulesReport: IOverviewReport = {
    date: new Date(),
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0IjoiV1YgTmV3IFByb2plY3QgVGVzdCA0Iiwib3JnYW5pemF0aW9uIjoicmFib3dlYi10ZXN0IiwibmJmIjoxNTU1NjQzODQ1LCJleHAiOjE1NTYyNDg2NDUsImlhdCI6MTU1NTY0Mzg0NX0.7KUrGPBMbuBdByj7WClwSyZitPzIq5ulipvV7exrobU",
    rescanUrl: 'https://azdoanalyticsdev.azurewebsites.net/api/scan/raboweb-test/WV%20New%20Project%20Test%204/globalpermissions',
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

export const DummyBuildReport: IBuildReport = {
    reports: [{
        id: '1234',
        pipeline: 'auto-lst',
        createdDate: "2019-02-12T11:34:18.8188815Z",
        artifactsStoredSecure: true,
        usesFortify: true,
        usesSonarQube: false
    },
    {
        id: '2435',
        pipeline: 'SM9',
        createdDate: "2019-01-12T11:34:18.8188815Z",
        artifactsStoredSecure: false,
        usesFortify: false,
        usesSonarQube: true
    }]
};

export const DummyReleaseReport: IReleaseReport = {
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

export const DummyRepositoriesReport: IRepositoryReport = {
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