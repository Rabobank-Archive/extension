export interface IEnvironment {
    id: string;
    name: string;
}
export interface IItemReport {
    item: string;
    itemId: string;
    projectId: string;
    rules: IRule[];
    ciIdentifiers?: string | null | undefined;
    environments?: IEnvironment[];
}

export interface IRule {
    description: string;
    link: string | null;
    status: boolean | null | undefined;
    name: string;
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
    sM9ChangeId: string | null | undefined;
    sM9ChangeUrl: string | null;
}

export interface IExtensionDocument<TReport> {
    reports: TReport[];
}

export interface IPreventiveRulesReport
    extends IExtensionDocument<IItemReport> {
    date: Date;
    rescanUrl: string;
    hasReconcilePermissionUrl: string;
}
