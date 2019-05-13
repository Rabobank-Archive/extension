import { ICompliancyCheckerService } from "./ICompliancyCheckerService";
import { IAzDoService } from "./IAzDoService";

export class CompliancyCheckerService implements ICompliancyCheckerService {
    private azDoService: IAzDoService;
    
    constructor(azDoService: IAzDoService) {
        console.log("Using real compliancy checker service");

        this.azDoService = azDoService;
    }
    
    public async HasReconcilePermission(hasReconcilePermissionUrl: string): Promise<boolean> {
        const token = await this.azDoService.GetAppToken();

        let hasReconcilePermission: boolean = false;

        let requestInit: RequestInit = {
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
    
    public async DoReconcileRequest(reconcileUrl: string, onComplete?: () => void, onError?: () => void): Promise<void> {
        const token = await this.azDoService.GetAppToken();
        
        try {
            let requestInit: RequestInit = { headers: { Authorization: `Bearer ${token}` }};
            let response = await fetch(reconcileUrl, requestInit);
            if(response.ok)
            {
                if(onComplete)
                    onComplete();
            } else {
                if(onError)
                    onError();
            }
        } catch {
            if(onError)
                onError();
        }
    }

    public async DoRescanRequest(rescanUrl: string, onComplete: () => void, onError: () => void): Promise<void> {
        const token = await this.azDoService.GetAppToken();

        try {
            let requestInit: RequestInit = { headers: { Authorization: `Bearer ${token}` }};
            let response = await fetch(rescanUrl, requestInit);
            if (response.ok) {
              if(onComplete)
                onComplete();
            } else {
                if(onError)
                    onError();
            }
          } catch {
              if(onError)
                onError();
          }
    }
}