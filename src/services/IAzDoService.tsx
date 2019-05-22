export interface IItemReport {
    item: string;
    rules: IRule[];
}

export interface IRule {
    description: string;
    why: string;
    status: boolean;
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
    hasApprovalOptions: boolean;
    usesProductionEndpoints: boolean;
    hasBranchFilterForAllArtifacts: boolean;
    usesManagedAgentsOnly: boolean | null;
    allArtifactsAreFromBuild: boolean | null;
}

export interface IExtensionDocument<TReport> {
    reports: TReport[];
}

export interface IOverviewReport extends IExtensionDocument<IRule> {
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
