import { useState, useEffect, useReducer } from "react";
import { GetAzDoReportsFromDocumentStorage } from "../services/AzDoService";

export const useReport = <T>(type: string) => {
    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [reload, forceReload] = useReducer(x => x + 1, 0); // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate

    useEffect(() => {
        const fetchData = async () => {
            try {
                const report = await GetAzDoReportsFromDocumentStorage<T>(type);

                setData(report);
                setError("");
            } catch (e) {
                if (e.status !== 404) {
                    setError(
                        "Something went wrong while retrieving report data. Please try again later, or contact TAS if the issue persists."
                    );
                }
            }
            setLoading(false);
        };
        fetchData();
    }, [type, reload]);

    return { loading, error, setError, data, forceReload };
};
