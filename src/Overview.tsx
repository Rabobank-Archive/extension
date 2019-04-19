import * as React from 'react';
import { IAzDoService, IProjectRule, IExtensionDocument } from './services/IAzDoService';

import { Button } from "azure-devops-ui/Button";
import { ITableColumn, ISimpleTableCell, renderSimpleCell, SimpleTableCell, Table } from "azure-devops-ui/Table"
import { ObservableValue, ObservableArray } from 'azure-devops-ui/Core/Observable';
import { Page } from 'azure-devops-ui/Page';
import { Header } from 'azure-devops-ui/Header'
import { Card } from 'azure-devops-ui/Card'
import { Status, Statuses, StatusSize, IStatusProps } from "azure-devops-ui/Status";

interface ITableItem extends ISimpleTableCell {
    description: string,
    status: IStatusProps,
    reconcileUrl: string,
    token: string
}

interface IOverviewProps {
    azDoService: IAzDoService
}

interface IOverViewState extends IExtensionDocument<IProjectRule> {
    isLoading: boolean
}

export default class extends React.Component<IOverviewProps, IOverViewState> {
    private itemProvider = new ObservableArray<any>();

    constructor(props: IOverviewProps) {
        super(props);
        this.state = {
            date: new Date(0),
            reports: [], 
            token: undefined,
            isLoading: true
        }
    }

    async componentDidMount() {
        const data = await this.props.azDoService.GetReportsFromDocumentStorage<IProjectRule>("globalpermissions");
        this.itemProvider.push(...data.reports.map<ITableItem>(x => ({ description: x.description, reconcileUrl: x.reconcileUrl || '', status: x.status ? Statuses.Success : Statuses.Failed, token: data.token || '' })));

        this.setState({ isLoading: false });
    }

    private renderCheckmark(
        _rowIndex: number,
        columnIndex: number,
        tableColumn: ITableColumn<ITableItem>,
        tableItem: ITableItem
    ): JSX.Element {
        return (<SimpleTableCell columnIndex={columnIndex} key={tableColumn.id}>
            <Status
                {...tableItem.status}
                className="icon-large-margin"
                size={StatusSize.l}
            />
        </SimpleTableCell>);
    }
    
    private renderReconcileButton(
        _rowIndex: number,
        columnIndex: number,
        tableColumn: ITableColumn<ITableItem>,
        item: ITableItem
    ): JSX.Element {
        let content = item.status != Statuses.Success
            ? <Button
                primary={true}
                iconProps = {{ iconName: "TriggerAuto" }}
                onClick={() => fetch(item.reconcileUrl, { headers: { Authorization: `Bearer ${item.token}` }}) } 
                text="Reconcile" disabled={(item.reconcileUrl == "")} />
            : "";

        return (
            <SimpleTableCell
                columnIndex={columnIndex}
                tableColumn={tableColumn}
                key={"col-" + columnIndex}
                contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden">
                {content}
            </SimpleTableCell>);
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
                        { this.state.isLoading ?
                            <div>Loading...</div> :
                            <Table<ITableItem> columns={columns} itemProvider={this.itemProvider} behaviors={[]} />
                        }
                    </Card>
                </div>
            </Page>);
    }
}
