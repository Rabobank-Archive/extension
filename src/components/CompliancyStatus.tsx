import * as React from "react";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { Status, StatusSize, IStatusProps, Statuses } from "azure-devops-ui/Status";
import { css } from "azure-devops-ui/Util";

export interface ICompliancyStatusIndicatorData {
    statusProps: IStatusProps;
    label: string;
}

export function getPossibleCompliancyStatuses(): boolean[] {
    return [
        true,
        false,
    ];
};

export function getCompliancyStatusAsListItem(status: boolean): IListBoxItem<boolean> {
    const statusDetail = getCompliancyStatusIndicatorData(status);

    return {
        data: status,
        id: status ? "true" : "false",
        text: statusDetail.label,
        iconProps: {
            render: className => (
                <Status
                    {...statusDetail.statusProps}
                    className={css(className, statusDetail.statusProps.className)}
                    // @ts-ignore
                    size={StatusSize.m}
                    animated={false}
                />
            )
        }
    };
};

export function getCompliancyStatusIndicatorData(isCompliant: boolean): ICompliancyStatusIndicatorData {
    let indicatorData: ICompliancyStatusIndicatorData = isCompliant ? 
        {
            statusProps: Statuses.Success,
            label: "Compliant"
        } :
        {
            statusProps: Statuses.Failed,
            label: "Non-Compliant"
        }
    return indicatorData;
}