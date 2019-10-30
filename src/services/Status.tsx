import { Statuses, IStatusProps } from "azure-devops-ui/Status";

const getDevopsUiStatus = (value: null | undefined | boolean): IStatusProps =>
    value === null || value === undefined
        ? Statuses.Queued
        : value
        ? Statuses.Success
        : Statuses.Failed;

export { getDevopsUiStatus };
