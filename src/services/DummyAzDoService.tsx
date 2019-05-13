import { 
    DummyProjectRulesReport, 
    DummyReleaseReport, 
    DummyBuildReport, 
    DummyRepositoriesReport, 
    DummyBuildPipelinesReport, 
    DummyReleasePipelinesReport 
} from './DummyData';
import { IAzDoService } from './IAzDoService';

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export class DummyAzDoService implements IAzDoService {
    public async GetAppToken(): Promise<string> {
        const token = "DUMMYTOKEN!@#";
        console.log(`Called 'DummyAzDoService.GetAppToken()', returning '${token}'`)
        return token;
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
        case "repository":
            return DummyRepositoriesReport as unknown as TReport;
        case "buildpipelines":
            return DummyBuildPipelinesReport as unknown as TReport;
        case "releasepipelines":
            return DummyReleasePipelinesReport as unknown as TReport;
        default:
            throw Error(`unsupported collection ${documentCollectionName}`);
    }
}
