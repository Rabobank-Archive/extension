import * as React from 'react';
import { ITableColumn, ITable, Table, ColumnSorting, SortOrder, sortItems } from 'azure-devops-ui/Table';
import { ObservableArray } from 'azure-devops-ui/Core/Observable';

interface IState<TReport> {
    isLoading: boolean,
    error: string
}

interface IReportProperties<TReport> {
  columns: ITableColumn<any>[],
  reports: () => Promise<TReport[]>
}

export default class<TReport> extends React.Component<IReportProperties<TReport>, IState<TReport>> {
    private itemProvider: ObservableArray<any> = new ObservableArray<any>();
    
    constructor(props: IReportProperties<TReport>) {
        super(props);
        
        this.state = {
            error: '',
            isLoading: true
        };
    }
    
    async componentDidMount() {
        const reports = await this.props.reports();
        this.itemProvider.push(...reports);
        this.setState({ isLoading: false });
    }

    public render() {
        const component = this.state.isLoading 
            ? <span>Loading...</span> 
            : <Table<any> columns={this.props.columns} itemProvider={this.itemProvider} behaviors={[this.sortingBehavior]} />
              
        return (
            <div>
                <span className="error">{this.state.error}</span>
                { component }
            </div>
        )
    }

    private sortingBehavior = new ColumnSorting<any>(
        (
            columnIndex: number,
            proposedSortOrder: SortOrder,
            event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
        ) => {
            this.itemProvider.splice(
                0,
                this.itemProvider.length,
                ...sortItems<any>(
                    columnIndex,
                    proposedSortOrder,
                    this.sortFunctions(),
                    this.props.columns,
                    this.itemProvider.value
                )
            );
        }
    );

    private sortFunctions(): ((item1: any, item2: any) => number)[] {
        return this.props.columns.map(column => (
            (item1: any, item2: any): number => {
                console.log(column.id);
                let value1 = item1[column.id];
                let value2 = item2[column.id];

                if (typeof value1 === 'string' && typeof value2 === 'string') {
                    return value1.localeCompare(value2);
                }
                return (value1 - value2)
            }
        ));
    }
}

