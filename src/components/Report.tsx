/// <reference types="vss-web-extension-sdk" />

import * as React from 'react';
import { DetailsList, IColumn, DetailsListLayoutMode, SelectionMode } from 'office-ui-fabric-react';

interface IState<TReport> {
    reports: TReport[],
    columns: IColumn[],
    error: string
}

interface IReportProperties<TReport> {
  columns: IColumn[],
  document: string,
  dummy: TReport[]
}

export default class<TReport> extends React.Component<IReportProperties<TReport>, IState<TReport>> {
    constructor(props: IReportProperties<TReport>) {
        super(props);
        
        this.props.columns.forEach(column => column.onColumnClick = this._onColumnClick);
        this.state = {
            reports: [],
            error: '',
            columns: this.props.columns
        };
    }
   
    componentDidMount() {
      if (typeof VSS !== 'undefined') {
        VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData).then((service) => {
            var context = VSS.getWebContext();
            service.getDocument(this.props.document, context.project.name)
                .then((doc: { reports: TReport[]}) => this.setState(doc), (err: Error) => this.setState({ error: err.message }))
                .then(() => VSS.notifyLoadSucceeded());
        });
      } else {
          this.setState({ reports: this.props.dummy })
      }
    }

    public render() {
        return (
            <div>
                <span className="error">{this.state.error}</span>
                <DetailsList 
                    items={this.state.reports} 
                    columns={this.state.columns} 
                    layoutMode={DetailsListLayoutMode.fixedColumns} 
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
}

