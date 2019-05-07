export interface IProjectRule {
    description: string,
    why: string,
    status: boolean,
    reconcile: {
        impact: string[],
        url: string
    }
}

export interface IRepositoryReport {
    item: string,
    rules: IRepositoryRule[]
}

export interface IRepositoryRule {
    description: string,
    why: string,
    status: boolean,
    reconcile: {
        impact: string[],
        url: string
    } | undefined
}

export interface IBuildPipelineSetupReport {
    date: Date
}

export interface IBuildRule {
    id: string
    pipeline: string
    createdDate: string,
    artifactsStoredSecure: boolean
    usesFortify: boolean
    usesSonarQube: boolean
}

export interface IReleaseRule {
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

export interface IExtensionDocument<TReport> {
    reports: TReport[]
}

export interface IOverviewReport extends IExtensionDocument<IProjectRule> {
    date: Date,
    rescanUrl: string,
    hasReconcilePermissionUrl: string
}

export interface IRepositoriesReport extends IExtensionDocument<IRepositoryReport> {
    date: Date,
    rescanUrl: string,
    hasReconcilePermissionUrl: string
}

export interface IBuildReport extends IExtensionDocument<IBuildRule> {
}

export interface IReleaseReport extends IExtensionDocument<IReleaseRule> {
}

export interface IAzDoService {
    GetReportsFromDocumentStorage<TReport>(documentCollectionName: string): Promise<TReport>;

    GetAppToken(): Promise<string>;
}


