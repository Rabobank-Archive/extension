import React from "react";
import "./UnorderedList.css";
import { List } from "azure-devops-ui/List";
import { IItemProvider } from "azure-devops-ui/Utilities/Provider";

export const UnorderedList = ({
    itemProvider
}: {
    itemProvider: IItemProvider<string>;
}) => {
    const renderRow = (rowIndex: number, item: string): JSX.Element => (
        <tr className="bolt-list-row" data-row-index={rowIndex}>
            <td className="unordered-list-cell">&bull;</td>
            <td className="unordered-list-cell">{item}</td>
        </tr>
    );

    return <List itemProvider={itemProvider} renderRow={renderRow} />;
};
