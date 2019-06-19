import { GetAzDoAppToken, GetAzDoUser } from "./AzDoService";
import { delay } from "./Delay";
import { USE_COMPLIANCYCHECKER_SERVICE } from "./Environment";
import { trackException, trackTrace } from "./ApplicationInsights";
import axios, { AxiosRequestConfig } from "axios";

export function HasReconcilePermission(
    hasReconcilePermissionUrl: string
): Promise<boolean> {
    return USE_COMPLIANCYCHECKER_SERVICE
        ? HasRealReconcilePermission(hasReconcilePermissionUrl)
        : HasDummyReconcilePermission(hasReconcilePermissionUrl);
}

export function DoReconcileRequest(
    reconcileUrl: string,
    onComplete?: () => void,
    onError?: () => void
): Promise<void> {
    return USE_COMPLIANCYCHECKER_SERVICE
        ? DoRealReconcileRequest(reconcileUrl, onComplete, onError)
        : DoDummyReconcileRequest(reconcileUrl, onComplete, onError);
}

export function DoRescanRequest(
    rescanUrl: string,
    onComplete?: () => void,
    onError?: () => void
): Promise<void> {
    return USE_COMPLIANCYCHECKER_SERVICE
        ? DoRealRescanRequest(rescanUrl, onComplete, onError)
        : DoDummyRescanRequest(rescanUrl, onComplete, onError);
}

//#region Dummy implementations
async function HasDummyReconcilePermission(
    hasReconcilePermissionUrl: string
): Promise<boolean> {
    const retval: boolean = true;
    console.log(
        `Called 'HasReconcilePermission(${hasReconcilePermissionUrl})', returning '${retval}'`
    );
    return retval;
}

async function DoDummyReconcileRequest(
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

async function DoDummyRescanRequest(
    rescanUrl: string,
    onComplete?: () => void,
    onError?: () => void
): Promise<void> {
    console.log(
        `Called 'DoRescanRequest(${rescanUrl}, ${onComplete}, ${onError})`
    );
    await delay(2000);
    if (onComplete) onComplete();
}

//#endregion

//#region Real implementations
async function HasRealReconcilePermission(
    hasReconcilePermissionUrl: string
): Promise<boolean> {
    const token = await GetAzDoAppToken();
    const user = GetAzDoUser();

    let hasReconcilePermission: boolean = false;

    const requestInit: RequestInit = {
        headers: { Authorization: `Bearer ${token}` }
    };

    trackTrace("HasReconcilePermission started", {
        token: token,
        userName: user.name,
        userDisplayName: user.displayName,
        userId: user.id
    });

    try {
        let response = await fetch(hasReconcilePermissionUrl, requestInit);
        let responseJson = await response.json();
        hasReconcilePermission = responseJson as boolean;
    } catch (e) {
        // Don't do anything when this fails. Since by default user doesn't have permission to reconcile, this won't do any harm
        trackException(e);
        trackTrace("HasReconcilePermission failed", {
            token: token,
            userName: user.name,
            userDisplayName: user.displayName,
            userId: user.id,
            result: e
        });
    }
    trackTrace("HasReconcilePermission succeeded", {
        token: token,
        userName: user.name,
        userDisplayName: user.displayName,
        userId: user.id,
        result: hasReconcilePermission
    });
    return hasReconcilePermission;
}

async function DoRealReconcileRequest(
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
    } catch (e) {
        if (onError) onError();
        trackException(e);
    }
}

async function DoRealRescanRequest(
    rescanUrl: string,
    onComplete?: () => void,
    onError?: () => void
): Promise<void> {
    const token = await GetAzDoAppToken();

    try {
        let config: AxiosRequestConfig = {
            headers: { Authorization: `Bearer ${token}` }
        };
        await axios.get(rescanUrl, config);
        if (onComplete) onComplete();
    } catch (e) {
        if (onError) onError();
        trackException(e);
    }
}

//#endregion
