/// <reference types="vss-web-extension-sdk" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DetailsList, IColumn, DetailsListLayoutMode, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
import * as moment from 'moment';

export interface IRepositoryReport {
    repository: string,
    hasRequiredReviewerPolicy: boolean,
    date: string
}

export interface IRepositoryReportState {
    reports: IRepositoryReport[],
    columns: IColumn[],
    error: string
}

export class RepositoryReport extends React.Component<{}, IRepositoryReportState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            reports: [],
            error: null,
            columns: [{
                key: 'column1',
                fieldName: 'repository',
                name: 'Repository',
                minWidth: 250,
                maxWidth: 400,
                isResizable: true,
                onColumnClick: this._onColumnClick
            },
            {
                key: 'column2',
                fieldName: 'hasRequiredReviewerPolicy',
                name: 'Required Reviewer Policy',
                minWidth: 50,
                maxWidth: 250,
                isResizable: true,
                data: Boolean,
                onColumnClick: this._onColumnClick,
                onRender: (item: IRepositoryReport) => { item.hasRequiredReviewerPolicy ? <span>&#x2713;</span> : <span>&#10007;</span>}
            },
            {
                key: 'column3',
                fieldName: 'date',
                name: 'Checked',
                minWidth: 50,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                onRender: (item: IRepositoryReport) => <div>{moment(item.date).fromNow()}</div>
            }]
        };
    }

    componentDidMount() {
        VSS.getService(VSS.ServiceIds.ExtensionData).then((service: IExtensionDataService) => {
            var context = VSS.getWebContext();
            service.getDocument("GitRepositories", context.project.name)
                .then((doc: { reports: IRepositoryReport[]}) => this.setState(doc), (err: Error) => this.setState({ error: err.message }))
                .then(() => VSS.notifyLoadSucceeded());
        });
    }

    public render() {
        return (
            <div>
                <span className="error">{this.state.error}</span>
                <DetailsList 
                    items={this.state.reports} 
                    columns={this.state.columns} 
                    layoutMode={DetailsListLayoutMode.justified} 
                    selectionMode={SelectionMode.none} />
            </div>
        )
    }

    private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const { columns, reports } = this.state;
        const newColumns: IColumn[] = columns.slice();
        const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
        newColumns.forEach((newCol: IColumn) => {
          if (newCol === currColumn) {
            currColumn.isSortedDescending = !currColumn.isSortedDescending;
            currColumn.isSorted = true;
          } else {
            newCol.isSorted = false;
            newCol.isSortedDescending = true;
          }
        });
        const newItems = this._copyAndSort(reports, currColumn.fieldName!, currColumn.isSortedDescending);
        this.setState({
          columns: newColumns,
          reports: newItems
        });
    };
    
    private _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
      const key = columnKey as keyof T;
      return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
    }
}

initializeIcons();
ReactDOM.render((
    <RepositoryReport />
), document.getElementById('app'));
