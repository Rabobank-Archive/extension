export interface IProjectRule {
    description: string,
    status: boolean,
    reconcileUrl: string | undefined
}

export interface IReleaseReport {
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

export interface IBuildReport {
    id: string
    pipeline: string
    createdDate: string,
    artifactsStoredSecure: boolean
    usesFortify: boolean
    usesSonarQube: boolean
}

export interface IRepositoryReport {
    repository: string,
    hasRequiredReviewerPolicy: boolean,
    date: string
}

export interface IExtensionDocument<TReport> {
    date: Date,
    reports: TReport[]
}

export interface IAzDoService {
    GetReportsFromDocumentStorage<TReport>(documentCollectionName: string) : Promise<IExtensionDocument<TReport>>;
}


