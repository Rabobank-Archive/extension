import {
    IReleaseReport,
    IBuildReport,
    IOverviewReport,
    IRepositoriesReport
} from './IAzDoService';

export const DummyProjectRulesReport: IOverviewReport = {
    date: new Date(),
    rescanUrl: 'https://azdoanalyticsdev.azurewebsites.net/api/scan/raboweb-test/WV%20New%20Project%20Test%204/globalpermissions',
    hasReconcilePermissionUrl: 'https://azdoanalyticsdev.azurewebsites.net/api/reconcile/raboweb-test/WV%20New%20Project%20Test%204/haspermission',
    reports: [
        {
            description: "No one should be able to delete the Team Project",
            why: "To enforce auditability, no data should be deleted. Therefore, nobody should be able to delete the Team Project.",
            status: true,
            reconcile: {
                impact: [
                    "Rabobank Project Administrators group is created and added to Project Administrators",
                    "Delete team project permissions of the Rabobank Project Administrators group is set to deny",
                    "Members of the Project Administrators are moved to Rabobank Project Administrators",
                    "Delete team project permission is set to 'not set' for all other groups"
                ],
                url: 'http://something.com'
            }
        },
        {
            description: "Some rule that cannot autofix",
            why: "Some rule explanation",
            status: false,
            reconcile: {
                impact: [
                    "Typ gewoon blablabal wat mij betreft zet je er",
                    "henkie is een test",
                ],
                url: ''
            }
        },
        {
            description: "Just some dummy other rule",
            why: "Some other rule explanation",
            status: false,
            reconcile: {
                impact: [
                    "Dit is een test data zin, om te checken of blablablabal",
                    "Dit is een test data zin, om te checken of blablablabal",
                    "Members of the Project Administrators are moved to Rabobank Project Administrators",
                    "Delete team project permission is set to 'not set' for all other groups"
                ],
                url: 'http://something.com'
            }
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
                    why: "To enforce auditability, no data should be deleted. Therefore, nobody should be able to delete the repository.",
                    status: true
                },
                {
                    description: "Master and release branches are protected",
                    why: "To enforce the 4-eyes principle, appropriate branch policies should be configured on potential release branches.",
                    status: true
                }
            ]

        },
        {
            item: "rbo-feature-settings-ked",
            rules: [
                {
                    description: "Nobody can delete the repository",
                    why: "To enforce auditability, no data should be deleted. Therefore, nobody should be able to delete the repository.",
                    status: false
                },
                {
                    description: "Master and release branches are protected",
                    why: "To enforce the 4-eyes principle, appropriate branch policies should be configured on potential release branches.",
                    status: true
                }
            ]
        }
    ]
};