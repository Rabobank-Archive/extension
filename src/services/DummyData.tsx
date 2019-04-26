import { IExtensionDocument, IProjectRule, IReleaseReport, IBuildReport, IRepositoryReport, IOverviewReport, IRepositoriesReport } from './IAzDoService';

export const DummyProjectRulesReport: IOverviewReport = {
    date: new Date(),
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

export const DummyRepositoriesReport: IRepositoriesReport = {
    date: new Date(),
    reports: [
        {
            item: "investment-application-messages",
            rules: [
                {
                    description: "Nobody can delete the repository",
                    status: true
                },
                {
                    description: "Master and release branches are protected",
                    status: true
                }
            ]
            
        },
        {
            item: "rbo-feature-settings-ked",
            rules: [
                {
                    description: "Nobody can delete the repository",
                    status: false
                },
                {
                    description: "Master and release branches are protected",
                    status: true
                }
            ]
        }
    ]
};