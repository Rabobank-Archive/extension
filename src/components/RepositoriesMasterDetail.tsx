import * as React from "react";
import { Card } from "azure-devops-ui/Card";
import { IObservableValue, ObservableValue } from "azure-devops-ui/Core/Observable";
import { Header, TitleSize } from "azure-devops-ui/Header";
import { IListItemDetails, List, ListItem, ListSelection } from "azure-devops-ui/List";
import { DetailsPanel, MasterPanel, MasterPanelHeader } from "azure-devops-ui/MasterDetails";
import {
    BaseMasterDetailsContext,
    bindSelectionToObservable,
    createChildLayer,
    IDetailsAreaContent,
    IMasterDetailsContext,
    IMasterDetailsContextLayer,
    IMasterPanelContent,
    MasterDetailsContext
} from "azure-devops-ui/MasterDetailsContext";
import { Page } from "azure-devops-ui/Page";
import {
    ITableColumn,
    ITableRow,
    SimpleTableCell,
    Table,
    TwoLineTableCell,
    renderSimpleCell,
    ISimpleTableCell
} from "azure-devops-ui/Table";
import { TextField } from "azure-devops-ui/TextField";
import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";
import { IStatusProps, Statuses } from "azure-devops-ui/Status";
import { renderCheckmark } from "./TableRenderers";

interface IRepositoryCompliancyData {
    
    repositoryName: string;
    repositorySubtitle: string;
    rules: IRuleDetails[];
}

interface IRuleDetails extends ISimpleTableCell {
    description: string;
    status: IStatusProps;
}

const SampleData: IRepositoryCompliancyData[] = [
    {
        repositoryName: "Repo 1",
        repositorySubtitle: "subtitle 1",
        rules: [
            { description: "Rule nr 1", status: Statuses.Success },
            { description: "Rule nr 2", status: Statuses.Failed }
        ]
    },
    {
        repositoryName: "Repo 2",
        repositorySubtitle: "subtitle 2",
        rules: [
            { description: "Rule nr 1", status: Statuses.Success },
            { description: "Rule nr 2", status: Statuses.Failed }
        ]
    }
]

const initialPayload: IMasterDetailsContextLayer<IRepositoryCompliancyData, undefined> = {
    key: "initial",
    masterPanelContent: {
        renderContent: (parentItem, initialSelectedMasterItem) => (
            <InitialMasterPanelContent  initialSelectedMasterItem={initialSelectedMasterItem} />
        ),
        renderHeader: () => <MasterPanelHeader title={"Repositories"} />,
        renderSearch: () => (
            <TextField prefixIconProps={{ iconName: "Search" }} placeholder="Search doesn't work" />
        ),
        hideBackButton: false //somehow this HIDES the back button
    },
    detailsContent: {
        renderContent: item => <InitialDetailView detailItem={item} />
    },
    selectedMasterItem: new ObservableValue<IRepositoryCompliancyData>(SampleData[0]),
    parentItem: undefined
};

const InitialMasterPanelContent: React.FunctionComponent<{
    initialSelectedMasterItem: IObservableValue<IRepositoryCompliancyData>;
}> = props => {
    const [initialItemProvider] = React.useState(new ArrayItemProvider(SampleData));
    const [initialSelection] = React.useState(new ListSelection());

    React.useEffect(() => {
        bindSelectionToObservable(
            initialSelection,
            initialItemProvider,
            props.initialSelectedMasterItem
        );
    });

    return (
        <List
            itemProvider={initialItemProvider}
            selection={initialSelection}
            renderRow={renderInitialRow}
            width="100%"
        />
    );
};

const renderInitialRow = (
    index: number,
    item: IRepositoryCompliancyData,
    details: IListItemDetails<IRepositoryCompliancyData>,
    key?: string
): JSX.Element => {
    return (
        <ListItem
            className="master-example-row"
            key={key || "list-item" + index}
            index={index}
            details={details}
        >
            <div className="flex-row flex-center h-scroll-hidden" style={{ padding: "10px 0px" }}>
                <div className="flex-noshrink" style={{ width: "32px" }} />
                <div className="flex-column flex-shrink" style={{ minWidth: 0 }}>
                    <div className="primary-text text-ellipsis">{item.repositoryName}</div>
                    <div className="secondary-text">{item.repositorySubtitle}</div>
                </div>
            </div>
        </ListItem>
    );
};

const InitialDetailView: React.FunctionComponent<{
    detailItem: IRepositoryCompliancyData;
}> = props => {
    const masterDetailsContext = React.useContext(MasterDetailsContext);
    const { detailItem } = props;

    const columns: ITableColumn<IRuleDetails>[] = [
        {
            id: "description",
            name: "Description",
            width: new ObservableValue(450),
            renderCell: renderSimpleCell
        },
        { id: "status", name: "Status", width: new ObservableValue(75), renderCell: renderCheckmark }
    ];

    return (
        <Page>
            <Header
                description={detailItem.repositorySubtitle}
                title={detailItem.repositoryName}
                titleSize={TitleSize.Large}
            />
            <div className="page-content page-content-top">
                <Card
                    className="bolt-card-no-vertical-padding"
                    contentProps={{ contentPadding: false }}
                >
                    <Table<IRuleDetails>
                        columns={columns}
                        itemProvider={new ArrayItemProvider<IRuleDetails>(detailItem.rules)}
                        showLines={true}
                    />
                </Card>
            </div>
        </Page>
    );
};

const masterDetailsContext: IMasterDetailsContext = new BaseMasterDetailsContext(
    initialPayload,
    () => {
    }
);

const RepositoriesMasterDetail: React.SFC<{}> = props => {
    return (
        <MasterDetailsContext.Provider value={masterDetailsContext}>
            <div className="flex-row" style={{ width: "100%" }}>
                <MasterPanel />
                <DetailsPanel />
            </div>
        </MasterDetailsContext.Provider>
    );
};

export default RepositoriesMasterDetail;