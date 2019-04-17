import { DummyProjectRulesReport, DummyReleaseReport, DummyBuildReport, DummyRepositoriesReport } from './DummyData'
import { CommonServiceIds, getClient, IExtensionDataService, IProjectPageService } from "azure-devops-extension-api"
import * as SDK from "azure-devops-extension-sdk";

export interface IProjectRule {
    description: string,
    status: boolean,
    reconcileUrl: string | undefined
}

export interface IReleaseReport {
    pipeline: string,
    release: string,
    releaseId: string,
    environment: string,
    createdDate: string,
    hasApprovalOptions: boolean,
    usesProductionEndpoints: boolean,
    hasBranchFilterForAllArtifacts: boolean,
    usesManagedAgentsOnly: boolean | null,
    allArtifactsAreFromBuild: boolean | null
}

export interface IBuildReport {
    id: string
    pipeline: string
    createdDate: string,
    artifactsStoredSecure: boolean
    usesFortify: boolean
    usesSonarQube: boolean
}

export interface IRepositoryReport {
    repository: string,
    hasRequiredReviewerPolicy: boolean,
    date: string
}

export interface IExtensionDocument<TReport> {
    date: Date,
    reports: TReport[]
}

export interface IAzDoService {
    GetReportsFromDocumentStorage<TReport>(documentCollectionName: string) : Promise<IExtensionDocument<TReport>>;
}

export class AzDoService implements IAzDoService {
    public async GetReportsFromDocumentStorage<TReport>(documentCollectionName: string): Promise<IExtensionDocument<TReport>> {
        const token = await SDK.getAccessToken();
        
        let dataService = await SDK.getService<IExtensionDataService>("ms.vss-features.extension-data-service");
        let projectService = await SDK.getService<IProjectPageService>("ms.vss-tfs-web.tfs-page-data-service");
        let project = await projectService.getProject();
        let dataManager = await dataService.getExtensionDataManager(SDK.getExtensionContext().id, token);

        return dataManager.getDocument(documentCollectionName, project!.name);
    }
}

export class DummyAzDoService implements IAzDoService {
    
    public async GetReportsFromDocumentStorage<TReport>(documentCollectionName: string): Promise<IExtensionDocument<TReport>> {
        let retval: IExtensionDocument<TReport> = {
            date: new Date(),
            reports: []
        };
        
        switch(documentCollectionName)
        {
            case "globalpermissions":
                retval.date = DummyProjectRulesReport.date;
                DummyProjectRulesReport.reports.map(r => retval.reports.push(r as unknown as TReport));
                break;

            case "BuildReports":
                retval.date = DummyBuildReport.date;
                DummyBuildReport.reports.map(r => retval.reports.push(r as unknown as TReport));
                break;

            case "Releases":
                retval.date = DummyReleaseReport.date;
                DummyReleaseReport.reports.map(r => retval.reports.push(r as unknown as TReport));
                break;

            case "GitRepositories":
                retval.date = DummyRepositoriesReport.date;
                DummyRepositoriesReport.reports.map(r => retval.reports.push(r as unknown as TReport));
                break;
        }

        return retval;
    }

}