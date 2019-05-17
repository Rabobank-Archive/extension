import * as React from "react";

import { ITableColumn, SimpleTableCell } from "azure-devops-ui/Table";
import moment from "moment";
import { IStatusProps, Status, StatusSize } from "azure-devops-ui/Status";
import { Icon } from "azure-devops-ui/Icon";
import { ITooltipProps } from "azure-devops-ui/TooltipEx";

export function renderDate(
    _rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<any>,
    item: any
): JSX.Element {
    let value = item[tableColumn.id] as string;

    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
        >
            {moment(value).fromNow()}
        </SimpleTableCell>
    );
}

export function renderString(
    _rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<any>,
    item: any
): JSX.Element {
    let value = item[tableColumn.id] as string;

    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
        >
            {value}
        </SimpleTableCell>
    );
}

export function renderStringWithWhyTooltip(
    _rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<any>,
    item: any
): JSX.Element {
    let value = item[tableColumn.id] as string;

    let tooltip: ITooltipProps = {
        text: item["why"]
    };

    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
        >
            {value}{" "}
            <Icon
                iconName={"Info"}
                style={{ marginLeft: "10px" }}
                tooltipProps={tooltip}
            />
        </SimpleTableCell>
    );
}

export function renderCheckmark(
    _rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<any>,
    item: any
): JSX.Element {
    let value = item[tableColumn.id] as IStatusProps;

    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
        >
            <Status
                {...value}
                className="icon-large-margin"
                // @ts-ignore
                size={StatusSize.l}
            />
        </SimpleTableCell>
    );
}
