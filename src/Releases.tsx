/// <reference types="vss-web-extension-sdk" />

import * as React from 'react';
import { DetailsList, IColumn, DetailsListLayoutMode, SelectionMode } from 'office-ui-fabric-react';
import moment from 'moment';
import Checkmark from './components/Checkmark';

interface IReport {
    pipeline: string,
    release: string,
    releaseId: string,
    environment: string,
    createdDate: string,
    hasApprovalOptions: boolean,
    usesProductionEndpoints: boolean
}

interface IReportState {
    reports: IReport[],
    columns: IColumn[],
    error: string
}

export default class extends React.Component<{}, IReportState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            reports: [],
            error: '',
            columns: [{
                key: 'column1',
                fieldName: 'pipeline',
                name: 'Pipeline',
                minWidth: 250,
                maxWidth: 400,
                isResizable: true,
                onColumnClick: this._onColumnClick
            },
            {
                key: 'column2',
                fieldName: 'release',
                name: 'Release',
                minWidth: 50,
                maxWidth: 250,
                isResizable: true,
                onColumnClick: this._onColumnClick
            },
            {
                key: 'column3',
                fieldName: 'environment',
                name: 'Environment',
                minWidth: 50,
                maxWidth: 250,
                isResizable: true,
                onColumnClick: this._onColumnClick
            },
            {
                key: 'column4',
                fieldName: 'createdDate',
                name: 'Created',
                minWidth: 50,
                maxWidth: 100,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                onRender: (item: IReport) => <div>{moment(item.createdDate).fromNow()}</div>
            },
            {
                key: 'column5',
                fieldName: 'hasApprovalOptions',
                name: 'Approval',
                minWidth: 50,
                maxWidth: 50,
                isResizable: true,
                data: Boolean,
                onColumnClick: this._onColumnClick,
                onRender: (item: IReport) => <Checkmark checked={item.hasApprovalOptions} />
            },
            {
                key: 'column6',
                fieldName: 'usesProductionEndpoints',
                name: 'Production Endpoints',
                minWidth: 50,
                maxWidth: 50,
                isResizable: true,
                data: Boolean,
                onColumnClick: this._onColumnClick,
                onRender: (item: IReport) => <Checkmark checked={item.usesProductionEndpoints} />
            }]
        };
    }

    componentDidMount() {
      if (typeof VSS !== 'undefined') {
        VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData).then((service) => {
            var context = VSS.getWebContext();
            service.getDocument("Releases", context.project.name)
                .then((doc: { reports: IReport[]}) => this.setState(doc), (err: Error) => this.setState({ error: err.message }))
                .then(() => VSS.notifyLoadSucceeded());
        });
      } else {
        this.setState({ reports: this.dummyReports() })
      }
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
        return items.slice(0).sort((a: T, b: T) => {
            let left = a[key];
            let right = b[key];

            if (typeof left === 'string' && typeof right === 'string') {
                return left.localeCompare(right) * (isSortedDescending ? 1 : -1);
            }
            return ((isSortedDescending ? left < right : left > right) ? 1 : -1)
        });
    }

    private dummyReports(): IReport[] {
      return [{
        "release": "Release-200",
        "environment": "raboweb-test",
        "releaseId": "2375",
        "createdDate": "2019-02-12T11:39:12.9157118Z",
        "usesProductionEndpoints": true,
        "hasApprovalOptions": false,
        "pipeline": "TAS Azure DevOps Extensions"
      },
      {
        "release": "Release-199",
        "environment": "raboweb-test",
        "releaseId": "2374",
        "createdDate": "2019-02-12T11:34:18.8188815Z",
        "usesProductionEndpoints": true,
        "hasApprovalOptions": false,
        "pipeline": "TAS Azure DevOps Extensions"
      }];
    }  
}

