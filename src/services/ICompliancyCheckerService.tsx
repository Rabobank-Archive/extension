export interface ICompliancyCheckerService {
    HasReconcilePermission(hasReconcilePermissionUrl: string): Promise<boolean>;
    DoReconcileRequest(
        reconcileUrl: string,
        onComplete?: () => void,
        onError?: () => void
    ): Promise<void>;
    DoRescanRequest(
        rescanUrl: string,
        onComplete?: () => void,
        onError?: () => void
    ): Promise<void>;
}
