import { DummyProjectRulesReport, DummyReleaseReport, DummyBuildReport, DummyRepositoriesReport } from './DummyData';
import { IAzDoService, IExtensionDocument } from './IAzDoService';

export class DummyAzDoService implements IAzDoService {
    public async GetReportsFromDocumentStorage<TReport>(documentCollectionName: string): Promise<IExtensionDocument<TReport>> {
        let retval: IExtensionDocument<TReport> = {
            date: new Date(),
            reports: []
        };
        switch (documentCollectionName) {
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
