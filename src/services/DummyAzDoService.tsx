import { DummyProjectRulesReport, DummyReleaseReport, DummyBuildReport, DummyRepositoriesReport } from './DummyData';
import { IAzDoService, IExtensionDocument } from './IAzDoService';
import { IExtensionDataService } from 'azure-devops-extension-api';

export class DummyAzDoService implements IAzDoService {
    public async GetReportsFromDocumentStorage<TReport>(documentCollectionName: string): Promise<IExtensionDocument<TReport>> 
    { 
        return Promise.resolve<IExtensionDocument<TReport>>(loadData(documentCollectionName));
    }
}

function loadData<TReport>(documentCollectionName: string) : IExtensionDocument<TReport> {
    switch (documentCollectionName) {
        case "globalpermissions":
            return DummyProjectRulesReport as unknown as IExtensionDocument<TReport>;
        case "BuildReports":
            return DummyBuildReport as unknown as IExtensionDocument<TReport>;
        case "Releases":
            return DummyReleaseReport as unknown as IExtensionDocument<TReport>;
        case "GitRepositories":
            return DummyRepositoriesReport as unknown as IExtensionDocument<TReport>;
    }

    return { date: new Date(Date.now()), reports: [], token: '' }
}
