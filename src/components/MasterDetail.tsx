import * as React from "react";
import { Card } from "azure-devops-ui/Card";
import {
    IObservableValue,
    ObservableArray,
    ObservableValue
} from "azure-devops-ui/Core/Observable";
import { Header, TitleSize } from "azure-devops-ui/Header";
import {
    IListItemDetails,
    List,
    ListItem,
    ListSelection
} from "azure-devops-ui/List";
import {
    DetailsPanel,
    MasterPanel,
    MasterPanelHeader
} from "azure-devops-ui/MasterDetails";
import {
    BaseMasterDetailsContext,
    bindSelectionToObservable,
    IMasterDetailsContext,
    IMasterDetailsContextLayer,
    MasterDetailsContext
} from "azure-devops-ui/MasterDetailsContext";
import { Page } from "azure-devops-ui/Page";
import { ITableColumn, SimpleTableCell, Table } from "azure-devops-ui/Table";
import { TextField } from "azure-devops-ui/TextField";
import { renderCheckmark, renderStringWithWhyTooltip } from "./TableRenderers";
import {
    IStatusProps,
    Status,
    Statuses,
    StatusSize
} from "azure-devops-ui/Status";
import { sortingBehavior } from "./TableBehaviors";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { IItemReport } from "../services/IAzDoService";
import ReconcileButton from "./ReconcileButton";
import { ICompliancyCheckerService } from "../services/ICompliancyCheckerService";

interface IReportMaster {
    item: string;
    rules: IReportRule[];
}

interface IReportRule {
    description: string;
    why: string;
    status: IStatusProps;
    hasReconcilePermission: boolean;
    reconcileUrl: string;
    reconcileImpact: string[];
    compliancyCheckerService: ICompliancyCheckerService;
}

function compareItemReports(a: IItemReport, b: IItemReport) {
    return a.item.localeCompare(b.item);
}

function isCompliant(item: IReportMaster): boolean {
    return !item.rules.some(rule => {
        return rule.status !== Statuses.Success;
    });
}

export class MasterDetail extends React.Component<
    {
        title: string;
        data: IItemReport[];
        hasReconcilePermission: boolean;
        compliancyCheckerService: ICompliancyCheckerService;
    },
    {}
> {
    private filteredDataProvider: ObservableArray<
        IReportMaster
    > = new ObservableArray<IReportMaster>();
    private selectedMasterItem: ObservableValue<
        IReportMaster
    > = new ObservableValue<IReportMaster>(
        this.ToIReportMasterArray(this.props.data)[0]
    );

    private searchValue = new ObservableValue<string>("");
    private showCompliantRepos = new ObservableValue<boolean>(true);
    private showNonCompliantRepos = new ObservableValue<boolean>(true);

    private ToIReportMasterArray(
        itemReports: IItemReport[]
    ): Array<IReportMaster> {
        return itemReports.map(m => {
            let master: IReportMaster = {
                item: m.item,
                rules: m.rules.map(x => {
                    let rule: IReportRule = {
                        description: x.description,
                        why: x.why,
                        hasReconcilePermission: this.props
                            .hasReconcilePermission,
                        reconcileUrl: x.reconcile ? x.reconcile.url : "",
                        reconcileImpact: x.reconcile ? x.reconcile.impact : [],
                        status: x.status ? Statuses.Success : Statuses.Failed,
                        compliancyCheckerService: this.props
                            .compliancyCheckerService
                    };
                    return rule;
                })
            };
            return master;
        });
    }

    renderReconcileButton(
        rowIndex: number,
        columnIndex: number,
        tableColumn: ITableColumn<IReportRule>,
        item: IReportRule
    ): JSX.Element {
        let content =
            item.status !== Statuses.Success && item.hasReconcilePermission ? (
                <ReconcileButton reconcilableItem={item} />
            ) : (
                ""
            );

        return (
            <SimpleTableCell
                columnIndex={columnIndex}
                tableColumn={tableColumn}
                key={"col-" + columnIndex}
                contentClassName="fontWeightSemiBold font-weight-semibold fontSizeM font-size-m scroll-hidden"
            >
                {content}
            </SimpleTableCell>
        );
    }

    componentDidMount() {
        this.fillRepositoriesList();

        this.searchValue.subscribe((value, action) => {
            this.filterRepositoriesList(
                value,
                this.showCompliantRepos.value,
                this.showNonCompliantRepos.value
            );
        });

        this.showCompliantRepos.subscribe((value, action) => {
            this.filterRepositoriesList(
                this.searchValue.value,
                value,
                this.showNonCompliantRepos.value
            );
        });

        this.showNonCompliantRepos.subscribe((value, action) => {
            this.filterRepositoriesList(
                this.searchValue.value,
                this.showCompliantRepos.value,
                value
            );
        });
    }

    componentDidUpdate() {
        this.fillRepositoriesList();
    }

    private fillRepositoriesList() {
        let previouslySelectedItem = this.selectedMasterItem.value;
        this.filterRepositoriesList(
            this.searchValue.value,
            this.showCompliantRepos.value,
            this.showNonCompliantRepos.value
        );

        if (previouslySelectedItem) {
            let newlySelectedItem = this.filteredDataProvider.value!.find(
                value => {
                    return value.item === previouslySelectedItem.item;
                }
            );
            this.selectedMasterItem.value = newlySelectedItem
                ? newlySelectedItem
                : this.filteredDataProvider.value[0];
        }
    }

    private filterRepositoriesList(
        searchFilter: string,
        showCompliantRepos: boolean,
        showNonCompliantRepos: boolean
    ) {
        this.filteredDataProvider.value = this.ToIReportMasterArray(
            this.props.data.sort(compareItemReports)
        ).filter((value, index, array) => {
            return (
                value.item.includes(searchFilter) &&
                ((showCompliantRepos && isCompliant(value)) ||
                    (showNonCompliantRepos && !isCompliant(value)))
            );
        });
    }

    private initialPayload: IMasterDetailsContextLayer<
        IReportMaster,
        undefined
    > = {
        key: "initial",
        masterPanelContent: {
            renderContent: (parentItem, initialSelectedMasterItem) => (
                <InitialMasterPanelContent
                    initialSelectedMasterItem={initialSelectedMasterItem}
                    filteredDataProvider={this.filteredDataProvider}
                />
            ),
            renderHeader: () => <MasterPanelHeader title={this.props.title} />,
            renderSearch: () => (
                <div>
                    <TextField
                        prefixIconProps={{ iconName: "Search" }}
                        placeholder="Search..."
                        onChange={(e, newValue) =>
                            (this.searchValue.value = newValue)
                        }
                        value={this.searchValue}
                    />
                    <div
                        className="flex-row flex-center flex-grow scroll-hidden"
                        style={{ marginTop: "5px" }}
                    >
                        <Checkbox
                            onChange={(event, checked) =>
                                (this.showCompliantRepos.value = checked)
                            }
                            checked={this.showCompliantRepos}
                            label="Compliant"
                        />
                        <div style={{ marginRight: "10px" }} />
                        <Checkbox
                            onChange={(event, checked) =>
                                (this.showNonCompliantRepos.value = checked)
                            }
                            checked={this.showNonCompliantRepos}
                            label="Non-compliant"
                        />
                        <div className="flex-grow" />
                    </div>
                </div>
            ),
            hideBackButton: false //somehow this HIDES the back button
        },
        detailsContent: {
            renderContent: item => <this.InitialDetailView detailItem={item} />
        },
        selectedMasterItem: this.selectedMasterItem,
        parentItem: undefined
    };

    private InitialDetailView: React.FunctionComponent<{
        detailItem: IReportMaster;
    }> = props => {
        const { detailItem } = props;

        const columns: ITableColumn<IReportRule>[] = [
            {
                id: "description",
                name: "Description",
                width: new ObservableValue(-100),
                renderCell: renderStringWithWhyTooltip,
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "status",
                name: "Status",
                width: new ObservableValue(75),
                renderCell: renderCheckmark,
                sortProps: {
                    ariaLabelAscending: "Sorted A to Z",
                    ariaLabelDescending: "Sorted Z to A"
                }
            },
            {
                id: "reconcile",
                width: new ObservableValue(130),
                renderCell: this.renderReconcileButton,
                sortProps: {}
            }
        ];

        let content: JSX.Element;
        if (typeof detailItem !== "undefined") {
            let itemProvider = new ObservableArray<IReportRule>(
                detailItem.rules
            );

            content = (
                <Page>
                    <Header
                        title={detailItem.item}
                        // @ts-ignore
                        titleSize={TitleSize.Large}
                    />
                    <div className="page-content page-content-top">
                        <Card
                            className="bolt-card-no-vertical-padding"
                            contentProps={{ contentPadding: false }}
                        >
                            <Table<IReportRule>
                                columns={columns}
                                itemProvider={itemProvider}
                                showLines={true}
                                behaviors={[
                                    sortingBehavior(itemProvider, columns)
                                ]}
                            />
                        </Card>
                    </div>
                </Page>
            );
        } else {
            content = (
                <Page>
                    <Header
                        title={this.props.title}
                        // @ts-ignore
                        titleSize={TitleSize.Large}
                    />
                    <div className="page-content page-content-top">
                        <Card className="bolt-card-no-vertical-padding">
                            <p>
                                Select an item on the left to view it's
                                compliancy data.
                            </p>
                        </Card>
                    </div>
                </Page>
            );
        }
        return content;
    };

    private masterDetailsContext: IMasterDetailsContext = new BaseMasterDetailsContext(
        this.initialPayload,
        () => {}
    );

    render() {
        return (
            <MasterDetailsContext.Provider value={this.masterDetailsContext}>
                <div className="flex-row">
                    <MasterPanel />
                    <DetailsPanel />
                </div>
            </MasterDetailsContext.Provider>
        );
    }
}

const InitialMasterPanelContent: React.FunctionComponent<{
    initialSelectedMasterItem: IObservableValue<IReportMaster>;
    filteredDataProvider: ObservableArray<IReportMaster>;
}> = props => {
    const [initialSelection] = React.useState(new ListSelection());

    React.useEffect(() => {
        bindSelectionToObservable(
            initialSelection,
            props.filteredDataProvider,
            props.initialSelectedMasterItem
        );
    });

    return (
        <List
            itemProvider={props.filteredDataProvider}
            selection={initialSelection}
            renderRow={renderRow}
            width="100%"
        />
    );
};

const renderRow = (
    index: number,
    item: IReportMaster,
    details: IListItemDetails<IReportMaster>,
    key?: string
): JSX.Element => {
    return (
        <ListItem
            className="master-example-row"
            key={key || "list-item" + index}
            index={index}
            details={details}
        >
            <div
                className="flex-row flex-center h-scroll-hidden"
                style={{ padding: "10px 0px" }}
            >
                <div className="flex-noshrink" style={{ width: "32px" }} />
                <div
                    className="flex-column flex-shrink"
                    style={{ minWidth: 0 }}
                >
                    <div className="primary-text text-ellipsis">
                        {item.item}
                    </div>
                    <div className="secondary-text">
                        {isCompliant(item) ? (
                            <div>
                                <Status
                                    {...Statuses.Success}
                                    className="icon-large-margin"
                                    // @ts-ignore
                                    size={StatusSize.s}
                                />
                                Compliant
                            </div>
                        ) : (
                            <div>
                                <Status
                                    {...Statuses.Failed}
                                    className="icon-large-margin"
                                    // @ts-ignore
                                    size={StatusSize.s}
                                />
                                Non-compliant
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ListItem>
    );
};
