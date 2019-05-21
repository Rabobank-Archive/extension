import React from "react";
import { List, IListItemDetails } from "azure-devops-ui/List";
import { IItemProvider } from "azure-devops-ui/Utilities/Provider";
import { IReadonlyObservableValue } from "azure-devops-ui/Core/Observable";
import "../css/UnorderedList.css";

export class UnorderedList extends React.Component<
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
            <tr className="bolt-list-row" data-row-index={rowIndex}>
                <td className="unordered-list-cell">&bull;</td>
                <td className="unordered-list-cell">{item}</td>
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
