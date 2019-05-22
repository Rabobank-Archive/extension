import { ICompliancyCheckerService } from "./ICompliancyCheckerService";
import { GetAzDoAppToken } from "./AzDoService";

export class CompliancyCheckerService implements ICompliancyCheckerService {
    constructor() {
        console.log("Using real compliancy checker service");
    }

    public async HasReconcilePermission(
        hasReconcilePermissionUrl: string
    ): Promise<boolean> {
        const token = await GetAzDoAppToken();

        let hasReconcilePermission: boolean = false;

        const requestInit: RequestInit = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            let response = await fetch(hasReconcilePermissionUrl, requestInit);
            let responseJson = await response.json();
            hasReconcilePermission = responseJson as boolean;
        } catch {
            // Don't do anything when this fails. Since by default user doesn't have permission to reconcile, this won't do any harm
        }
        return hasReconcilePermission;
    }

    public async DoReconcileRequest(
        reconcileUrl: string,
        onComplete?: () => void,
        onError?: () => void
    ): Promise<void> {
        const token = await GetAzDoAppToken();

        try {
            let requestInit: RequestInit = {
                headers: { Authorization: `Bearer ${token}` }
            };
            let response = await fetch(reconcileUrl, requestInit);
            if (response.ok) {
                if (onComplete) onComplete();
            } else {
                if (onError) onError();
            }
        } catch {
            if (onError) onError();
        }
    }

    public async DoRescanRequest(
        rescanUrl: string,
        onComplete: () => void,
        onError: () => void
    ): Promise<void> {
        const token = await GetAzDoAppToken();

        try {
            let requestInit: RequestInit = {
                headers: { Authorization: `Bearer ${token}` }
            };
            let response = await fetch(rescanUrl, requestInit);
            if (response.ok) {
                if (onComplete) onComplete();
            } else {
                if (onError) onError();
            }
        } catch {
            if (onError) onError();
        }
    }
}
