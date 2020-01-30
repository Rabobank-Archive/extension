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
    data?: {}
): Promise<void> {
    return USE_COMPLIANCYCHECKER_SERVICE
        ? DoRealReconcileRequest(reconcileUrl, data)
        : DoDummyReconcileRequest(reconcileUrl);
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

async function DoDummyReconcileRequest(reconcileUrl: string): Promise<void> {
    console.log(`Called 'DoReconcileRequest(${reconcileUrl})`);
    await delay(2000);
    return Promise.resolve();
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

    const config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${token}` }
    };

    trackTrace("HasReconcilePermission started", {
        token: token,
        userName: user.name,
        userDisplayName: user.displayName,
        userId: user.id
    });

    try {
        const url = `${hasReconcilePermissionUrl}?userId=${user.id}`;
        const response = await axios.get(url, config);
        hasReconcilePermission = response.data as boolean;
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
    data?: {}
): Promise<void> {
    const token = await GetAzDoAppToken();
    const user = GetAzDoUser();

    let config: AxiosRequestConfig = {
        headers: { Authorization: `Bearer ${token}` }
    };

    await axios.post(`${reconcileUrl}?userId=${user.id}`, data, config);
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
