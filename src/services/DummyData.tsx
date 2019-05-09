import {
  IReleaseReport,
  IBuildReport,
  IOverviewReport,
  IRepositoriesReport,
  IBuildPipelinesReport
} from "./IAzDoService";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { IPipelineItem } from "../components/BuildPipelinesList";

export const DummyProjectRulesReport: IOverviewReport = {
  date: new Date(),
  rescanUrl:
    "https://azdoanalyticsdev.azurewebsites.net/api/scan/raboweb-test/WV%20New%20Project%20Test%204/globalpermissions",
  hasReconcilePermissionUrl:
    "https://azdoanalyticsdev.azurewebsites.net/api/reconcile/raboweb-test/WV%20New%20Project%20Test%204/haspermission",
  reports: [
    {
      description: "No one should be able to delete the Team Project",
      why:
        "To enforce auditability, no data should be deleted. Therefore, nobody should be able to delete the Team Project.",
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
      why: "Some rule explanation",
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
      why: "Some other rule explanation",
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
  rescanUrl: "https://reqres.in",
  hasReconcilePermissionUrl: "some-url",
  reports: [
    {
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
        },
        {
          description: "Master and release branches are protected",
          why:
            "To enforce the 4-eyes principle, appropriate branch policies should be configured on potential release branches.",
          status: true,
          reconcile: {
            url: "",
            impact: ["some impact"]
          }
        }
      ]
    },
    {
      item: "rbo-feature-settings-ked",
      rules: [
        {
          description: "Nobody can delete the repository",
          why:
            "To enforce auditability, no data should be deleted. Therefore, nobody should be able to delete the repository.",
          status: false,
          reconcile: {
            url: "",
            impact: ["some impact"]
          }
        },
        {
          description: "Master and release branches are protected",
          why:
            "To enforce the 4-eyes principle, appropriate branch policies should be configured on potential release branches.",
          status: true,
          reconcile: {
            url: "",
            impact: ["some impact"]
          }
        }
      ]
    }
  ]
};

export const DummyBuildPipelineReport: IBuildPipelinesReport = {
  date: new Date(),
  rescanUrl: "https://reqres.in",
  hasReconcilePermissionUrl: "some-url",
  reports: [
    {
      item: "enterprise-distributed-service",
      rules: [
        {
          description: "Nobody can delete the pipeline",
          why:
            "To enforce auditability, no data should be deleted. Therefore, nobody should be able to delete the pipeline.",
          status: true,
          reconcile: {
            url: "http://some-reconcile-url",
            impact: ["some impact"]
          }
        }
      ]
    },
    {
      item: "microservice-architecture",
      rules: [
        {
          description: "Nobody can delete the pipeline",
          why:
            "To enforce auditability, no data should be deleted. Therefore, nobody should be able to delete the pipeline.",
          status: false,
          reconcile: {
            url: "",
            impact: ["some impact"]
          }
        }
      ]
    },
    {
      item: "mobile-ios-app",
      rules: [
        {
          description: "Nobody can delete the pipeline",
          why:
            "To enforce auditability, no data should be deleted. Therefore, nobody should be able to delete the pipeline.",
          status: false,
          reconcile: {
            url: "",
            impact: ["some impact"]
          }
        }
      ]
    },
    {
      item: "node-package",
      rules: [
        {
          description: "Nobody can delete the pipeline",
          why:
            "To enforce auditability, no data should be deleted. Therefore, nobody should be able to delete the pipeline.",
          status: false,
          reconcile: {
            url: "",
            impact: ["some impact"]
          }
        }
      ]
    }
  ]
}

const tempPipelineItems: IPipelineItem[] = [
  {
    name: "enterprise-distributed-service",
    isCompliant: true,
    lastRunData: {
      buildId: 1234,
      buildName: "Update dependencies and resolve TypeScript errors",
      buildNumber: "832674.2",
      isCompliant: false,
      startTime: new Date(2018, 12, 4, 11, 12, 13)
    },
    favorite: new ObservableValue<boolean>(true)
  },
  {
    name: "microservice-architecture",
    isCompliant: true,
    lastRunData: {
      buildId: 1234,
      buildName: "Moved rescan button to header",
      buildNumber: "35672.2",
      isCompliant: false,
      startTime: new Date(2018, 12, 4, 11, 12, 13)
    },
    favorite: new ObservableValue<boolean>(true)
  },
  {
    name: "mobile-ios-app",
    isCompliant: false,
    lastRunData: {
      buildId: 1234,
      buildName: "Changes required for running as separate repo",
      buildNumber: "48213.5",
      isCompliant: false,
      startTime: new Date(2018, 12, 4, 11, 12, 13)
    },
    favorite: new ObservableValue<boolean>(false)
  },
  {
    name: "node-package",
    isCompliant: true,
    lastRunData: {
      buildId: 1234,
      buildName: "Added why description to rules",
      buildNumber: "32828.1",
      isCompliant: false,
      startTime: new Date(2018, 12, 4, 11, 12, 13)
    },
    favorite: new ObservableValue<boolean>(true)
  },
  {
    name: "parallel-stages",
    isCompliant: false,
    lastRunData: {
      buildId: 1234,
      buildName: "Merge reconcile-impact to refs/head/master",
      buildNumber: "847567.2",
      isCompliant: true,
      startTime: new Date(2018, 12, 4, 11, 12, 13)
    },
    favorite: new ObservableValue<boolean>(false)
  },
  {
    name: "simple-web-app",
    isCompliant: true,
    lastRunData: {
      buildId: 1234,
      buildName: "Initial commit",
      buildNumber: "22467.2",
      isCompliant: false,
      startTime: new Date(2018, 12, 4, 11, 12, 13)
    },
    favorite: new ObservableValue<boolean>(false)
  }
];

export const dummyPipelineItems: IPipelineItem[] = [];
for (let i = 0; i < 20; i++) {
  dummyPipelineItems.push(...tempPipelineItems);
}
