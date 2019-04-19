import { DummyProjectRulesReport, DummyReleaseReport, DummyBuildReport, DummyRepositoriesReport } from './DummyData';
import { IAzDoService, IExtensionDocument } from './IAzDoService';
import { IExtensionDataService } from 'azure-devops-extension-api';

export class DummyAzDoService implements IAzDoService {
    public async GetReportsFromDocumentStorage<TReport>(documentCollectionName: string): Promise<TReport> 
    { 
        return Promise.resolve<TReport>(loadData(documentCollectionName));
    }
}

function loadData<TReport>(documentCollectionName: string) : TReport {
    switch (documentCollectionName) {
        case "globalpermissions":
            return DummyProjectRulesReport as unknown as TReport;
        case "BuildReports":
            return DummyBuildReport as unknown as TReport;
        case "Releases":
            return DummyReleaseReport as unknown as TReport;
        case "GitRepositories":
            return DummyRepositoriesReport as unknown as TReport;
    }

    throw Error(`unsupported collection ${documentCollectionName}`);
}
