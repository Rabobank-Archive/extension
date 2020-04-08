import {
    IExtensionDataService,
    IProjectPageService,
} from "azure-devops-extension-api";

import {
    DummyProjectRulesReport,
    DummyRepositoriesReport,
    DummyBuildPipelinesReport,
    DummyReleasePipelinesReport,
} from "./DummyData";
import { USE_AZDO_SERVICE } from "./Environment";
import { delay } from "./Delay";
import * as JWT from "jsonwebtoken";
import {
    IUserContext,
    getUser,
    getAppToken,
    getAccessToken,
    getService,
    getExtensionContext,
} from "azure-devops-extension-sdk";

let appToken: string | undefined;

export function GetAzDoUser(): IUserContext {
    return USE_AZDO_SERVICE ? GetRealAzDoUser() : GetDummyAzDoUser();
}

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
function GetDummyAzDoUser(): IUserContext {
    return {
        descriptor: "dummy-descriptor",
        displayName: "dummy-displayname",
        id: "dummy-id",
        imageUrl: "https://dummy-image-url",
        name: "dummy-name",
    };
}

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
function GetRealAzDoUser(): IUserContext {
    return getUser();
}

async function GetRealAzDoAppToken(): Promise<string> {
    if (!appToken || IsTokenExpired(appToken)) {
        appToken = await getAppToken();
    }
    return appToken;
}

export function IsTokenExpired(token: string): boolean {
    var decoded = JWT.decode(token) as any;
    var currentTime = Date.now().valueOf() / 1000;
    return currentTime > decoded["exp"];
}

async function GetRealAzDoReportsFromDocumentStorage<TReport>(
    documentCollectionName: string
): Promise<TReport> {
    const token = await getAccessToken();
    const dataService = await getService<IExtensionDataService>(
        "ms.vss-features.extension-data-service"
    );
    const projectService = await getService<IProjectPageService>(
        "ms.vss-tfs-web.tfs-page-data-service"
    );
    const project = await projectService.getProject();
    const dataManager = await dataService.getExtensionDataManager(
        getExtensionContext().id,
        token
    );
    return dataManager.getDocument(documentCollectionName, project!.name);
}
//#endregion
