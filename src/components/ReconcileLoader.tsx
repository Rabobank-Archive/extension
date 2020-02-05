import * as React from "react";

import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";

const ReconcileLoader = () => (
    <Status
        {...Statuses.Running}
        key="reconciling"
        // @ts-ignore
        size={StatusSize.xl}
        text="Reconciling..."
    />
);

export default ReconcileLoader;
