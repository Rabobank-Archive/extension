/// <reference types="vss-web-extension-sdk" />

import * as React from 'react';
import { DetailsList, IColumn, DetailsListLayoutMode, SelectionMode } from 'office-ui-fabric-react/lib/DetailsList';
import moment from 'moment';
import Checkmark from './components/Checkmark';

interface IReport {
    repository: string,
    hasRequiredReviewerPolicy: boolean,
    date: string
}

interface IState {
    reports: IReport[],
    columns: IColumn[],
    error: string
}

export default class extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            reports: [],
            error: '',
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
                onRender: (item: IReport) => <Checkmark checked={item.hasRequiredReviewerPolicy} />
            },
            {
                key: 'column3',
                fieldName: 'date',
                name: 'Checked',
                minWidth: 50,
                isResizable: true,
                onColumnClick: this._onColumnClick,
                onRender: (item: IReport) => <div>{moment(item.date).fromNow()}</div>
            }]
        };
    }

    componentDidMount() {
      if (typeof VSS !== 'undefined') {
        VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData).then((service) => {
            var context = VSS.getWebContext();
            service.getDocument("GitRepositories", context.project.name)
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
          "repository": "investment-application-messages",
          "hasRequiredReviewerPolicy": true,
          "date": "2019-02-07T18:30:56.0654773+00:00"
        },
        {
          "repository": "rbo-feature-settings-ked",
          "hasRequiredReviewerPolicy": true,
          "date": "2019-02-07T18:30:56.0654773+00:00"
        }];
    }  
}

