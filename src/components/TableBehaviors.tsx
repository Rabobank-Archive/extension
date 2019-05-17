import {
    ColumnSorting,
    SortOrder,
    sortItems,
    ITableColumn
} from "azure-devops-ui/Table";
import {
    ObservableArray,
    ObservableValue
} from "azure-devops-ui/Core/Observable";

export function sortingBehavior(
    itemProvider: ObservableArray<any>,
    columns: ITableColumn<any>[]
) {
    let sortingBehavior = new ColumnSorting<any>(
        (
            columnIndex: number,
            proposedSortOrder: SortOrder,
            event:
                | React.KeyboardEvent<HTMLElement>
                | React.MouseEvent<HTMLElement>
        ) => {
            itemProvider.splice(
                0,
                itemProvider.length,
                ...sortItems<any>(
                    columnIndex,
                    proposedSortOrder,
                    sortFunctions(columns),
                    columns,
                    itemProvider.value
                )
            );
        }
    );
    return sortingBehavior;
}

export function onSize(
    event: MouseEvent,
    columnIndex: number,
    width: number,
    column: ITableColumn<any>
) {
    (column.width as ObservableValue<number>).value = width;
}

function sortFunctions(
    columns: ITableColumn<any>[]
): ((item1: any, item2: any) => number)[] {
    return columns.map(column => (item1: any, item2: any): number => {
        let value1 = item1[column.id];
        let value2 = item2[column.id];

        if (value1["color"] && value2["color"]) {
            return value1["color"].localeCompare(value2["color"]);
        }

        if (typeof value1 === "string" && typeof value2 === "string") {
            return value1.localeCompare(value2);
        }

        return value1 - value2;
    });
}
