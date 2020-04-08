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

export const GetAzDoUser = USE_AZDO_SERVICE ? getUser : getDummyUser;

export const GetAzDoAppToken = USE_AZDO_SERVICE
    ? GetRealAzDoAppToken
    : GetDummyAzDoAppToken;

export const GetAzDoReportsFromDocumentStorage = USE_AZDO_SERVICE
    ? GetRealAzDoReportsFromDocumentStorage
    : GetDummyReportsFromDocumentStorage;

function getDummyUser(): IUserContext {
    return {
        descriptor: "dummy-descriptor",
        displayName: "dummy-displayname",
        id: "dummy-id",
        imageUrl: "https://dummy-image-url",
        name: "dummy-name",
    };
}

function GetDummyAzDoAppToken(): Promise<string> {
    const token = "DUMMYTOKEN!@#";
    return Promise.resolve(token);
}

async function GetDummyReportsFromDocumentStorage<TReport>(
    collection: string
): Promise<TReport> {
    await delay(1000);
    return loadData(collection);
}

function loadData<TReport>(collection: string): TReport {
    switch (collection) {
        case "globalpermissions":
            return (DummyProjectRulesReport as unknown) as TReport;
        case "repository":
            return (DummyRepositoriesReport as unknown) as TReport;
        case "buildpipelines":
            return (DummyBuildPipelinesReport as unknown) as TReport;
        case "releasepipelines":
            return (DummyReleasePipelinesReport as unknown) as TReport;
        default:
            throw Error(`unsupported collection ${collection}`);
    }
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
    collection: string
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
    return dataManager.getDocument(collection, project!.name);
}
