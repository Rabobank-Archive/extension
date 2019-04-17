import * as React from 'react';
import Checkmark from './components/Checkmark';
import Report from './components/NewReport';
import { IAzDoService, IProjectRule, IExtensionDocument } from './services/IAzDoService'

import { Button } from "azure-devops-ui/Button";
import { ITableColumn, ISimpleTableCell, renderSimpleCell, SimpleTableCell, ColumnFill } from "azure-devops-ui/Table"
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { Page } from 'azure-devops-ui/Page';
import { Header, TitleSize } from 'azure-devops-ui/Header'
import { Card } from 'azure-devops-ui/Card'
import { Status, Statuses, StatusSize, IStatusProps } from "azure-devops-ui/Status";
import { Tooltip } from "azure-devops-ui/TooltipEx";

interface IStatusIndicatorData {
    statusProps: IStatusProps;
    label: string;
}

interface ITableItem extends ISimpleTableCell {
    description: string,
    status: number,
    reconcileUrl: string,
    token: string
}

interface IOverviewProps {
    azDoService: IAzDoService
}

function getStatusIndicatorData(status: number): IStatusIndicatorData {
    const indicatorData: IStatusIndicatorData = {
        label: "Success",
        statusProps: Statuses.Success
    };

    if(status > 0)
    {
        indicatorData.statusProps = Statuses.Success;
        indicatorData.label = "Running";
    } else {
        indicatorData.statusProps = Statuses.Failed;
        indicatorData.label = "Failed";
    }

    return indicatorData;
}

export default class extends React.Component<IOverviewProps, {}> {
    constructor(props: IOverviewProps) {
        super(props);
    }

    private renderCheckmark(
        rowIndex: number,
        columnIndex: number,
        tableColumn: ITableColumn<ITableItem>,
        tableItem: ITableItem
    ): JSX.Element {
        return (
            <SimpleTableCell
                columnIndex={columnIndex}
                tableColumn={tableColumn}
                key={"col-" + columnIndex}
                contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
            >
                <Status
                    {...getStatusIndicatorData(tableItem.status).statusProps}
                    className="icon-large-margin"
                    size={StatusSize.l}
                />
                <div className="flex-row scroll-hidden">
                    <Tooltip overflowOnly={true}>
                        <span className="text-ellipsis">{tableItem.name}</span>
                    </Tooltip>
                </div>
            </SimpleTableCell>
        );
    }
    
    private renderReconcileButton(
        rowIndex: number,
        columnIndex: number,
        tableColumn: ITableColumn<ITableItem>,
        tableItem: ITableItem
    ): JSX.Element {

        let button = tableItem.status == 0
            ? <Button
                primary={true}
                iconProps = {{ iconName: "TriggerAuto" }}
                onClick={() => fetch(tableItem.reconcileUrl, { headers: { Authorization: `Bearer ${tableItem.token}` }}) } 
                text="Reconcile" disabled={(tableItem.reconcileUrl == "")} />
            : "";

        return (
            <SimpleTableCell
                columnIndex={columnIndex}
                tableColumn={tableColumn}
                key={"col-" + columnIndex}
                contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
            >
            {button}
            </SimpleTableCell>
        );
    }

    render() {
        const columns: ITableColumn<ITableItem>[] = [
            {
                id: 'description',
                name: "Description",
                renderCell: renderSimpleCell,
                width: new ObservableValue(450),
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: 'status',
                name: 'Status',
                width: new ObservableValue(75),
                renderCell: this.renderCheckmark,
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: 'reconcileUrl',
                name: '',
                width: new ObservableValue(130),
                renderCell: this.renderReconcileButton 
            }
        ];

        return (
            <Page>
                <Header
                    title={"Project compliancy"}
                    titleSize={0}
                    titleIconProps={{ iconName: "OpenSource" }}
                />

                <div className="page-content page-content-top">
                    <p>We would ❤ getting in touch on how to have a secure setup that works out for you, so join us on our <a href="https://confluence.dev.rabobank.nl/display/MTTAS/Sprint+Review+Menu" target="_blank">bi-weekly sprint review</a> @UC-T15!</p>
                    <p>More information on the effective <a href="https://confluence.dev.rabobank.nl/display/vsts/Azure+DevOps+Project+group+permissions" target="_blank">Azure Devops Project group permissions</a> that are used for the secure setup.</p>
                    <Card>
                        <Report columns={columns} reports={async () => (await this.props.azDoService.GetReportsFromDocumentStorage<IProjectRule>("globalpermissions")).reports} />
                    </Card>
                </div>
            </Page>);
    }
}
