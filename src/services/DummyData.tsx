import {
    IReleaseReport,
    IBuildReport,
    IPreventiveRulesReport
} from "./IAzDoService";

const projectRules = [
    {
        description: "No one should be able to delete the Team Project",
        name: "Dummy",
        link: "http://documentation",
        status: true,
        reconcile: {
            impact: [
                "Rabobank Project Administrators group is created and added to Project Administrators",
                "Delete team project permissions of the Rabobank Project Administrators group is set to deny",
                "Members of the Project Administrators are moved to Rabobank Project Administrators",
                "Delete team project permission is set to 'not set' for all other groups"
            ],
            url: "http://something.com"
        }
    },
    {
        description: "Some rule that cannot autofix",
        name: "Dummy",
        link: "http://documentation",
        status: false,
        reconcile: {
            impact: [
                "Typ gewoon blablabal wat mij betreft zet je er",
                "henkie is een test"
            ],
            url: ""
        }
    },
    {
        description: "Just some dummy other rule",
        name: "Dummy",
        link: null,
        status: false,
        reconcile: {
            impact: [
                "Dit is een test data zin, om te checken of blablablabal",
                "Dit is een test data zin, om te checken of blablablabal",
                "Members of the Project Administrators are moved to Rabobank Project Administrators",
                "Delete team project permission is set to 'not set' for all other groups"
            ],
            url: "http://something.com"
        }
    },
    {
        description: "Another dummy other rule",
        name: "Dummy",
        link: null,
        status: null,
        reconcile: {
            impact: [
                "Dit is een test data zin, om te checken of blablablabal",
                "Dit is een test data zin, om te checken of blablablabal",
                "Members of the Project Administrators are moved to Rabobank Project Administrators",
                "Delete team project permission is set to 'not set' for all other groups"
            ],
            url: "http://something.com"
        }
    }
];

export const DummyProjectRulesReport: IPreventiveRulesReport = {
    date: new Date(),
    rescanUrl:
        "https://azdoanalyticsdev.azurewebsites.net/api/scan/raboweb-test/WV%20New%20Project%20Test%204/globalpermissions",
    hasReconcilePermissionUrl:
        "https://azdoanalyticsdev.azurewebsites.net/api/reconcile/raboweb-test/WV%20New%20Project%20Test%204/haspermission",
    reports: [
        {
            item: "",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: projectRules
        }
    ]
};

export const DummyBuildReport: IBuildReport = {
    reports: [
        {
            id: "1234",
            pipeline: "auto-lst",
            createdDate: "2019-02-12T11:34:18.8188815Z",
            artifactsStoredSecure: true,
            usesFortify: true,
            usesSonarQube: false
        },
        {
            id: "2435",
            pipeline: "SM9",
            createdDate: "2019-01-12T11:34:18.8188815Z",
            artifactsStoredSecure: false,
            usesFortify: false,
            usesSonarQube: true
        }
    ]
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
            allArtifactsAreFromBuild: false,
            sM9ChangeId: null,
            sM9ChangeUrl: null
        },
        {
            release: "Release-199",
            environment: "raboweb-test",
            releaseId: "2374",
            createdDate: "2019-02-12T11:34:18.8188815Z",
            usesProductionEndpoints: false,
            hasApprovalOptions: null,
            pipeline: "TAS Azure DevOps Extensions",
            hasBranchFilterForAllArtifacts: false,
            usesManagedAgentsOnly: true,
            allArtifactsAreFromBuild: true,
            sM9ChangeId: null,
            sM9ChangeUrl: null
        },
        {
            release: "Release-198",
            environment: "raboweb-test",
            releaseId: "2374",
            createdDate: "2019-02-12T11:34:18.8188815Z",
            usesProductionEndpoints: null,
            hasApprovalOptions: false,
            pipeline: "TAS Azure DevOps Extensions",
            hasBranchFilterForAllArtifacts: false,
            usesManagedAgentsOnly: null,
            allArtifactsAreFromBuild: null,
            sM9ChangeId: "C000691701",
            sM9ChangeUrl: "http://itsm.rabobank.nl/SM"
        }
    ]
};

const repoRules = [
    {
        description: "Nobody can delete the repository",
        name: "Dummy",
        link: "http://documentation",
        status: true,
        reconcile: {
            url: "http://some-reconcile-url",
            impact: ["some impact"]
        }
    },
    {
        description: "Master and release branches are protected",
        name: "Dummy",
        link: "http://documentation",
        status: false,
        reconcile: {
            url: "http://some-reconcile-url",
            impact: ["some impact"]
        }
    },
    {
        description: "No secrets",
        name: "Dummy",
        link: "http://documentation",
        status: null,
        reconcile: {
            url: "http://some-reconcile-url",
            impact: ["some impact"]
        }
    }
];

export const DummyRepositoriesReport: IPreventiveRulesReport = {
    date: new Date(),
    rescanUrl: "https://reqres.in",
    hasReconcilePermissionUrl: "some-url",
    reports: [
        {
            item: "investment-application-messages",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: repoRules
        },
        {
            item: "investment-application-messages",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: repoRules
        },
        {
            item: "investment-application-messages",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: repoRules
        },
        {
            item: "investment-application-messages",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: repoRules
        },
        {
            item: "investment-application-messages",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: repoRules
        },
        {
            item: "investment-application-messages",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: repoRules
        },
        {
            item: "investment-application-messages",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: repoRules
        },
        {
            item: "investment-application-messages",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: repoRules
        },
        {
            item: "investment-application-messages",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: repoRules
        },
        {
            item: "investment-application-messages",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: repoRules
        },
        {
            item: "rbo-feature-settings-ked",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: repoRules
        }
    ]
};

const buildRules = [
    {
        description: "Nobody can delete the pipeline",
        name: "Dummy",
        link: "http://documentation",
        status: true,
        reconcile: {
            url: "http://some-reconcile-url",
            impact: ["some impact"]
        }
    }
];

export const DummyBuildPipelinesReport: IPreventiveRulesReport = {
    date: new Date(),
    rescanUrl: "https://reqres.in",
    hasReconcilePermissionUrl: "some-url",
    reports: [
        {
            item: "microservice-architecture",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: buildRules
        },
        {
            item: "enterprise-distributed-service",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: buildRules
        },
        {
            item: "mobile-ios-app",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: buildRules
        },
        {
            item: "node-package",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: buildRules
        }
    ]
};

const releasePipelineRules = [
    {
        description: "Nobody can delete the pipeline",
        name: "Dummy",
        link: "http://documentation",
        status: false,
        reconcile: {
            url: "http://some-reconcile-url",
            impact: ["some impact"]
        }
    },
    {
        description: "Release pipeline has valid CMDB link",
        link: "https://confluence.dev.rabobank.nl/x/PqKbD",
        status: false,
        name: "ReleasePipelineHasDeploymentMethod",
        reconcile: {
            url:
                "https://azdocompliancydev.azurewebsites.net/api/reconcile/raboweb-test/53410703-e2e5-4238-9025-233bd7c811b3/releasepipelines/ReleasePipelineHasDeploymentMethod/4",
            impact: [
                "In the CMDB the deployment method for the CI is set to Azure DevOps and coupled to this release pipeline"
            ]
        }
    }
];

export const DummyReleasePipelinesReport: IPreventiveRulesReport = {
    date: new Date(),
    rescanUrl: "https://reqres.in",
    hasReconcilePermissionUrl: "some-url",
    reports: [
        {
            item: "enterprise-distributed-service",
            itemId: "71",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: releasePipelineRules,
            ciIdentifiers: "CI1312312,CI23444432,CI1231122",
            environments: [
                { id: "1", name: "UAT" },
                { id: "2", name: "PROD" }
            ]
        },
        {
            item: "microservice-architecture",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: releasePipelineRules,
            ciIdentifiers: "NON-PROD"
        },
        {
            item: "mobile-ios-app",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: releasePipelineRules
        },
        {
            item: "node-package",
            itemId: "1",
            projectId: "f64ffdfa-0c4e-40d9-980d-bb8479366fc5",
            rules: releasePipelineRules
        }
    ]
};
