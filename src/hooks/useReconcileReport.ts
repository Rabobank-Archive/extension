import { useEffect, useState } from "react";
import { HasReconcilePermission } from "../services/CompliancyCheckerService";
import { IPreventiveRulesReport } from "../services/IAzDoService";
import { useReport } from "./useReport";

export const useReconcileReport = (type: string) => {
    const report = useReport<IPreventiveRulesReport>(type);
    const [hasReconcilePermission, setHasReconcilePermission] = useState<
        boolean
    >(false);

    useEffect(() => {
        const fetchData = async () => {
            if (report.data) {
                try {
                    const hasReconcilePermission = await HasReconcilePermission(
                        report.data.hasReconcilePermissionUrl
                    );

                    setHasReconcilePermission(hasReconcilePermission);
                } catch {
                    report.setError(
                        "Something went wrong while probing reconcile permissions. Please try again later, or contact TAS if the issue persists."
                    );
                }
            }
        };
        fetchData();
    }, [report]);

    return {
        ...report,
        hasReconcilePermission
    };
};
