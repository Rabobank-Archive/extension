import { IExtensionDataService, IProjectPageService } from "azure-devops-extension-api";
import { IAzDoService, IExtensionDocument } from "./IAzDoService";

import * as SDK from "azure-devops-extension-sdk";

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
