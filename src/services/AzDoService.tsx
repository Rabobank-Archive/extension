import {
    IExtensionDataService,
    IProjectPageService,
    CommonServiceIds
} from "azure-devops-extension-api";

import * as SDK from "azure-devops-extension-sdk";
import {
    DummyProjectRulesReport,
    DummyBuildReport,
    DummyReleaseReport,
    DummyRepositoriesReport,
    DummyBuildPipelinesReport,
    DummyReleasePipelinesReport
} from "./DummyData";
import { USE_AZDO_SERVICE } from "./Environment";

let appToken: string | undefined;

export async function GetAzDoAppToken(): Promise<string> {
    return USE_AZDO_SERVICE ? GetRealAzDoAppToken() : GetDummyAzDoAppToken();
}

export async function GetAzDoReportsFromDocumentStorage<TReport>(
    documentCollectionName: string
): Promise<TReport> {
    return USE_AZDO_SERVICE
        ? GetRealAzDoReportsFromDocumentStorage<TReport>(documentCollectionName)
        : GetDummyReportsFromDocumentStorage<TReport>(documentCollectionName);
}

//#region Dummy implementations
async function GetDummyAzDoAppToken(): Promise<string> {
    const token = "DUMMYTOKEN!@#";
    console.log(
        `Called 'DummyAzDoService.GetAppToken()', returning '${token}'`
    );
    return token;
}

async function GetDummyReportsFromDocumentStorage<TReport>(
    documentCollectionName: string
): Promise<TReport> {
    // Simulate some waiting time
    await delay(1000);
    return Promise.resolve<TReport>(loadData(documentCollectionName));
}

function loadData<TReport>(documentCollectionName: string): TReport {
    switch (documentCollectionName) {
        case "globalpermissions":
            return (DummyProjectRulesReport as unknown) as TReport;
        case "BuildReports":
            return (DummyBuildReport as unknown) as TReport;
        case "Releases":
            return (DummyReleaseReport as unknown) as TReport;
        case "repository":
            return (DummyRepositoriesReport as unknown) as TReport;
        case "buildpipelines":
            return (DummyBuildPipelinesReport as unknown) as TReport;
        case "releasepipelines":
            return (DummyReleasePipelinesReport as unknown) as TReport;
        default:
            throw Error(`unsupported collection ${documentCollectionName}`);
    }
}
//#endregion

//#region Real implementations
async function GetRealAzDoAppToken(): Promise<string> {
    if (!appToken) {
        appToken = await SDK.getAppToken();
    }
    return appToken;
}

async function GetRealAzDoReportsFromDocumentStorage<TReport>(
    documentCollectionName: string
): Promise<TReport> {
    const token = await SDK.getAccessToken();
    const dataService = await SDK.getService<IExtensionDataService>(
        // @ts-ignore
        CommonServiceIds.ExtensionDataService
    );
    const projectService = await SDK.getService<IProjectPageService>(
        // @ts-ignore
        CommonServiceIds.ProjectPageService
    );
    const project = await projectService.getProject();
    const dataManager = await dataService.getExtensionDataManager(
        SDK.getExtensionContext().id,
        token
    );
    return dataManager.getDocument(documentCollectionName, project!.name);
}
//#endregion

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
