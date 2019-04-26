import { DummyProjectRulesReport, DummyReleaseReport, DummyBuildReport, DummyRepositoriesReport } from './DummyData';
import { IAzDoService, IExtensionDocument } from './IAzDoService';
import { IExtensionDataService } from 'azure-devops-extension-api';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export class DummyAzDoService implements IAzDoService {
    public async GetAppToken(): Promise<string> {
        return "DUMMYTOKEN123";
    }
    
    public async GetReportsFromDocumentStorage<TReport>(documentCollectionName: string): Promise<TReport> 
    { 
        // Simulate some waiting time
        await delay(1000);
        
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
