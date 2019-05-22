import { ICompliancyCheckerService } from "./ICompliancyCheckerService";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class DummyCompliancyCheckerService
    implements ICompliancyCheckerService {
    constructor() {
        console.log("Using dummy compliancy checker service");
    }

    public async HasReconcilePermission(
        hasReconcilePermissionUrl: string
    ): Promise<boolean> {
        const retval: boolean = true;
        console.log(
            `Called 'HasReconcilePermission(${hasReconcilePermissionUrl})', returning '${retval}'`
        );
        return retval;
    }

    public async DoReconcileRequest(
        reconcileUrl: string,
        onComplete?: () => void,
        onError?: () => void
    ): Promise<void> {
        console.log(
            `Called 'DoReconcileRequest(${reconcileUrl}, ${onComplete}, ${onError})`
        );
        await delay(2000);
        if (onComplete) onComplete();
    }

    public async DoRescanRequest(
        rescanUrl: string,
        onComplete?: (() => void) | undefined,
        onError?: (() => void) | undefined
    ): Promise<void> {
        console.log(
            `Called 'DoRescanRequest(${rescanUrl}, ${onComplete}, ${onError})`
        );
        await delay(2000);
        if (onComplete) onComplete();
    }
}
