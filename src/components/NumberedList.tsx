import React from "react";
import { List, IListItemDetails } from "azure-devops-ui/List";
import { IItemProvider } from "azure-devops-ui/Utilities/Provider";
import { IReadonlyObservableValue } from "azure-devops-ui/Core/Observable";

export class NumberedList extends React.Component<
    {
        itemProvider: IItemProvider<
            string | IReadonlyObservableValue<string | undefined>
        >;
    },
    {}
> {
    private renderItemRow(
        rowIndex: number,
        item: string,
        details: IListItemDetails<string>
    ): JSX.Element {
        return (
            <tr>
                <td>
                    {rowIndex + 1}. {item}
                </td>
            </tr>
        );
    }

    render() {
        return (
            <List
                itemProvider={this.props.itemProvider}
                renderRow={this.renderItemRow}
            />
        );
    }
}
