export interface IProjectRule {
    description: string,
    status: boolean,
    reconcileUrl: string
}

export interface IRepositoryRule {
    repository: string,
    hasRequiredReviewerPolicy: boolean,
    date: string
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
    token: string,
    rescanUrl: string
}

export interface IRepositoryReport extends IExtensionDocument<IRepositoryRule> {
}

export interface IBuildReport extends IExtensionDocument<IBuildRule> {
}

export interface IReleaseReport extends IExtensionDocument<IReleaseRule> {
}

export interface IAzDoService {
    GetReportsFromDocumentStorage<TReport>(documentCollectionName: string) : Promise<TReport>;
    GetAppToken(): Promise<string>;
}


