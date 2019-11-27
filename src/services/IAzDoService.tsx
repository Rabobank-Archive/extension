export interface IItemReport {
    item: string;
    rules: IRule[];
    ciIdentifiers?: string | null | undefined;
}

export interface IRule {
    description: string;
    link: string | null;
    status: boolean | null | undefined;
    reconcile:
        | {
              impact: string[];
              url: string;
          }
        | undefined;
}

export interface IBuildRule {
    id: string;
    pipeline: string;
    createdDate: string;
    artifactsStoredSecure: boolean;
    usesFortify: boolean;
    usesSonarQube: boolean;
}

export interface IReleaseRule {
    pipeline: string;
    release: string;
    releaseId: string;
    environment: string;
    createdDate: string;
    hasApprovalOptions: boolean | null | undefined;
    usesProductionEndpoints: boolean | null | undefined;
    hasBranchFilterForAllArtifacts: boolean | null | undefined;
    usesManagedAgentsOnly: boolean | null | undefined;
    allArtifactsAreFromBuild: boolean | null | undefined;
    relatedToSm9Change: boolean | null | undefined;
}

export interface IExtensionDocument<TReport> {
    reports: TReport[];
}

export interface IOverviewReport extends IExtensionDocument<IItemReport> {
    date: Date;
    rescanUrl: string;
    hasReconcilePermissionUrl: string;
}

export interface IRepositoriesReport extends IExtensionDocument<IItemReport> {
    date: Date;
    rescanUrl: string;
    hasReconcilePermissionUrl: string;
}

export interface IBuildPipelinesReport extends IExtensionDocument<IItemReport> {
    date: Date;
    rescanUrl: string;
    hasReconcilePermissionUrl: string;
}

export interface IReleasePipelinesReport
    extends IExtensionDocument<IItemReport> {
    date: Date;
    rescanUrl: string;
    hasReconcilePermissionUrl: string;
}

export interface IBuildReport extends IExtensionDocument<IBuildRule> {}

export interface IReleaseReport extends IExtensionDocument<IReleaseRule> {}
