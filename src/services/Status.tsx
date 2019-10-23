import { Statuses, IStatusProps } from "azure-devops-ui/Status";

export function getDevopsUiStatus(
    value: null | undefined | boolean
): IStatusProps {
    return value === null || value === undefined
        ? Statuses.Queued
        : value
        ? Statuses.Success
        : Statuses.Failed;
}
