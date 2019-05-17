import * as React from "react";
import { IFilter, FILTER_CHANGE_EVENT } from "azure-devops-ui/Utilities/Filter";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Card } from "azure-devops-ui/Card";
import {
    Table,
    ITableColumn,
    SimpleTableCell,
    TableCell,
    TwoLineTableCell
} from "azure-devops-ui/Table";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { Status, StatusSize } from "azure-devops-ui/Status";
import { Tooltip } from "azure-devops-ui/TooltipEx";
import { Observer } from "azure-devops-ui/Observer";
import { Button } from "azure-devops-ui/Button";
import { css } from "azure-devops-ui/Util";
import { Link } from "azure-devops-ui/Link";
import { Icon, IIconProps } from "azure-devops-ui/Icon";
import { Ago } from "azure-devops-ui/Ago";
import { AgoFormat } from "azure-devops-ui/Utilities/Date";
import { getCompliancyStatusIndicatorData } from "./CompliancyStatus";
import { dummyPipelineItems } from "../services/DummyData";

export interface IPipelineItem {
    name: string;
    isCompliant: boolean;
    lastRunData: IPipelineLastRun;
    favorite: ObservableValue<boolean>;
}

interface IPipelineLastRun {
    buildId: number;
    buildNumber: string;
    buildName: string;
    startTime?: Date;
    isCompliant: boolean;
}

interface IBuildPipelinesListProps {
    filter: IFilter;
}

interface IState {
    filtering: boolean;
    sortedItems: IPipelineItem[];
    filteredItems: IPipelineItem[];
}

export default class extends React.Component<IBuildPipelinesListProps, IState> {
    constructor(props: IBuildPipelinesListProps) {
        super(props);

        this.state = {
            filtering: false,
            sortedItems: [...dummyPipelineItems],
            filteredItems: [...dummyPipelineItems]
        };
    }

    private columns: ITableColumn<IPipelineItem>[] = [
        {
            id: "pipeline",
            name: "Pipeline",
            width: new ObservableValue(-33),
            renderCell: renderNameColumn,
            sortProps: {
                ariaLabelAscending: "Sorted A to Z",
                ariaLabelDescending: "Sorted Z to A"
            }
        },
        {
            id: "lastRun",
            name: "Last run",
            width: new ObservableValue(-33),
            renderCell: renderLastRunColumn,
            className: "pipelines-two-line-cell"
        },
        {
            id: "time",
            width: new ObservableValue(-33),
            renderCell: renderDateColumn
        },
        {
            id: "favorite",
            width: new ObservableValue(40),
            renderCell: renderFavoritesColumn
        }
    ];

    componentDidMount() {
        this.props.filter.subscribe(this.onFilterChanged, FILTER_CHANGE_EVENT);
    }

    componentWillUnmount() {
        this.props.filter.unsubscribe(
            this.onFilterChanged,
            FILTER_CHANGE_EVENT
        );
    }

    private onFilterChanged = () => {
        const filteredItems = this.filterItems(this.state.sortedItems);
        this.setState({
            filtering: this.props.filter.hasChangesToReset(),
            filteredItems: filteredItems
        });
    };

    private filterItems = (items: IPipelineItem[]) => {
        if (this.props.filter.hasChangesToReset()) {
            const filterText = this.props.filter.getFilterItemValue<string>(
                "keyword"
            );
            const pipelineSetupStatusses = this.props.filter.getFilterItemValue<
                boolean[]
            >("pipelineSetupStatus");
            const lastRunStatusses = this.props.filter.getFilterItemValue<
                boolean[]
            >("lastRunStatus");

            console.log(pipelineSetupStatusses);
            console.log(lastRunStatusses);

            const filteredItems = items.filter(item => {
                let includeItem = true;
                if (filterText) {
                    includeItem = item.name.indexOf(filterText) !== -1;
                }
                if (
                    includeItem &&
                    pipelineSetupStatusses &&
                    pipelineSetupStatusses.length
                ) {
                    includeItem = pipelineSetupStatusses.some(
                        s => s === item.isCompliant
                    );
                }
                if (
                    includeItem &&
                    lastRunStatusses &&
                    lastRunStatusses.length
                ) {
                    includeItem = lastRunStatusses.some(
                        s => s === item.lastRunData.isCompliant
                    );
                }
                return includeItem;
            });
            return filteredItems;
        } else {
            return [...items];
        }
    };

    render() {
        if (this.state.filtering && this.state.filteredItems.length === 0) {
            return "No pipeline items";
        }
        return (
            <Card
                className="flex-grow bolt-card-no-vertical-padding"
                contentProps={{ contentPadding: false }}
            >
                <Table<IPipelineItem>
                    //behaviors={[this.sortingBehavior]}
                    columns={this.columns}
                    itemProvider={
                        new ArrayItemProvider<IPipelineItem>(
                            this.state.filteredItems
                        )
                    }
                    showLines={true}
                    onSelect={(event, data) =>
                        console.log("Selected Row - " + data.index)
                    }
                    onActivate={(event, row) =>
                        console.log("Activated Row - " + row.index)
                    }
                />
            </Card>
        );
    }
}

function renderNameColumn(
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IPipelineItem>,
    tableItem: IPipelineItem
): JSX.Element {
    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
            contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
        >
            <Status
                {...getCompliancyStatusIndicatorData(tableItem.isCompliant)
                    .statusProps}
                className="icon-large-margin"
                // @ts-ignore
                size={StatusSize.l}
            />
            <div className="flex-row scroll-hidden">
                <Tooltip overflowOnly={true}>
                    <span className="text-ellipsis">{tableItem.name}</span>
                </Tooltip>
            </div>
        </SimpleTableCell>
    );
}

function renderLastRunColumn(
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IPipelineItem>,
    tableItem: IPipelineItem
): JSX.Element {
    const {
        buildId,
        buildNumber,
        buildName,
        isCompliant
    } = tableItem.lastRunData;
    const text = "#" + buildNumber + " \u00b7 " + buildName;
    const tooltip = `${text}`;
    const buildLink = "#" + buildId;
    return (
        <TwoLineTableCell
            className="bolt-table-cell-content-with-inline-link no-v-padding"
            key={"col-" + columnIndex}
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            line1={
                <span className="flex-row scroll-hidden">
                    <Tooltip text={text} overflowOnly>
                        <Link
                            className="fontSizeM font-size-m text-ellipsis bolt-table-link bolt-table-inline-link"
                            excludeTabStop
                            href={buildLink}
                        >
                            {text}
                        </Link>
                    </Tooltip>
                </span>
            }
            line2={
                <Tooltip text={tooltip} overflowOnly>
                    <span className="fontSize font-size secondary-text flex-row flex-baseline text-ellipsis">
                        <Link
                            className="fontSizeM font-size-m text-ellipsis bolt-table-link bolt-table-inline-link"
                            excludeTabStop
                            href="#build"
                        >
                            {CompliancyIcon({ isCompliant: isCompliant })}
                        </Link>
                    </span>
                </Tooltip>
            }
        />
    );
}

function CompliancyIcon(props: { isCompliant: boolean }) {
    let iconName: string = props.isCompliant ? "Emoji2" : "Sad";
    let text: string = props.isCompliant ? "Compliant" : "Non-Compliant";

    return (
        <div>
            {Icon({
                className: "bolt-table-inline-link-left-padding icon-margin",
                iconName: iconName,
                key: "release-type"
            })}{" "}
            {text}
        </div>
    );
}

function WithIcon(props: {
    className?: string;
    iconProps: IIconProps;
    children?: React.ReactNode;
}) {
    return (
        <div className={css(props.className, "flex-row flex-center")}>
            {Icon({ ...props.iconProps, className: "icon-margin" })}
            {props.children}
        </div>
    );
}

function renderDateColumn(
    _rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<any>,
    item: IPipelineItem
): JSX.Element {
    let date = item.lastRunData.startTime!;

    return (
        <SimpleTableCell
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
        >
            {WithIcon({
                className: "fontSize font-size",
                iconProps: { iconName: "Calendar" },
                // @ts-ignore
                children: <Ago date={date} format={AgoFormat.Extended} />
            })}
        </SimpleTableCell>
    );
}

function renderFavoritesColumn(
    rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<IPipelineItem>,
    tableItem: IPipelineItem
): JSX.Element {
    return (
        <TableCell
            className="bolt-table-cell-side-action"
            columnIndex={columnIndex}
            tableColumn={tableColumn}
            key={"col-" + columnIndex}
        >
            <div className="bolt-list-cell-content flex-column">
                <Observer favorite={tableItem.favorite}>
                    {(props: { favorite: boolean }) => {
                        const text = props.favorite
                            ? "Remove from favorites"
                            : "Add to favorites";
                        return (
                            <Button
                                ariaLabel={text}
                                className={css(
                                    !props.favorite &&
                                        "bolt-table-cell-content-reveal"
                                )}
                                excludeTabStop={true}
                                iconProps={{
                                    iconName: props.favorite
                                        ? "FavoriteStarFill"
                                        : "FavoriteStar",
                                    className: props.favorite
                                        ? "yellow"
                                        : undefined
                                }}
                                onClick={e => {
                                    tableItem.favorite.value = !tableItem
                                        .favorite.value;
                                    e.preventDefault();
                                }}
                                subtle
                            />
                        );
                    }}
                </Observer>
            </div>
        </TableCell>
    );
}
