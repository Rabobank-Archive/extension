import * as React from 'react';

import { ITableColumn, SimpleTableCell } from "azure-devops-ui/Table";
import moment from 'moment';
import { IStatusProps, Status, StatusSize } from "azure-devops-ui/Status";

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
            key={"col-" + columnIndex} >
            {moment(value).fromNow()}
        </SimpleTableCell>
    )
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
            key={"col-" + columnIndex} >
            {value}
        </SimpleTableCell>
    )
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
            key={"col-" + columnIndex} >
            <Status
                {...value}
                className="icon-large-margin"
                size={StatusSize.l}
            />
        </SimpleTableCell>
    )
}