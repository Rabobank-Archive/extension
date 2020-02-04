import { useEffect, useState, useReducer } from "react";
import { HasReconcilePermission } from "../services/CompliancyCheckerService";
import { GetAzDoReportsFromDocumentStorage } from "../services/AzDoService";
import { IPreventiveRulesReport } from "../services/IAzDoService";

export const useReport = (type: string) => {
    const [data, setData] = useState<IPreventiveRulesReport>({
        date: new Date(),
        hasReconcilePermissionUrl: "",
        rescanUrl: "",
        reports: []
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [reload, forceReload] = useReducer(x => x + 1, 0); // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    const [hasReconcilePermission, setHasReconcilePermission] = useState<
        boolean
    >(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const report = await GetAzDoReportsFromDocumentStorage<
                    IPreventiveRulesReport
                >(type);
                const hasReconcilePermission = await HasReconcilePermission(
                    report.hasReconcilePermissionUrl
                );

                setHasReconcilePermission(hasReconcilePermission);
                setData(report);
                setError("");
            } catch {
                setError(
                    "Something went wrong while retrieving report data. Please try again later, or contact TAS if the issue persists."
                );
            }
            setLoading(false);
        };
        fetchData();
    }, [reload, type]);

    return {
        loading,
        hasReconcilePermission,
        data,
        error,
        forceReload,
        setError
    };
};
