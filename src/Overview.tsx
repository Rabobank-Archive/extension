import * as React from 'react';
import { IAzDoService, IProjectRule, IExtensionDocument, IOverviewReport } from './services/IAzDoService';

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

export default class extends React.Component<IOverviewProps, { report: IOverviewReport, isLoading: boolean }> {
    private itemProvider = new ObservableArray<any>();

    constructor(props: IOverviewProps) {
        super(props);
        this.state = {
            report: {
                date: new Date(0),
                reports: [], 
                token: '',
                rescanUrl: ''
            },
            isLoading: true
        }
    }

    async componentDidMount() {
        const report = await this.props.azDoService.GetReportsFromDocumentStorage<IOverviewReport>("globalpermissions");
        this.itemProvider.push(...report.reports.map<ITableItem>(x => ({
             description: x.description, 
             reconcileUrl: x.reconcileUrl, 
             status: x.status ? Statuses.Success : Statuses.Failed, 
             token: report.token
        })));

        this.setState({ isLoading: false, report: report });
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
                width: new ObservableValue(450)
            },
            {
                id: 'status',
                name: 'Status',
                width: new ObservableValue(75),
                renderCell: this.renderCheckmark
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
                            <div>
                                <Button 
                                    iconProps = {{ iconName: "TriggerAuto" }}
                                    onClick={() => fetch(this.state.report.rescanUrl, { headers: { Authorization: `Bearer ${this.state.report.token}` }}) } 
                                    text="Rescan" />
                                <Table<ITableItem> columns={columns} itemProvider={this.itemProvider} behaviors={[]} />
                            </div>
                        }
                    </Card>
                </div>
            </Page>);
    }
}
