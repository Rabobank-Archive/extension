import * as React from 'react';
import { IAzDoService } from './services/IAzDoService';
import { Page } from 'azure-devops-ui/Page';
import { CustomHeader, HeaderIcon, TitleSize, HeaderTitleArea, HeaderTitleRow, HeaderTitle, HeaderDescription, Header } from 'azure-devops-ui/Header';
import { HeaderCommandBar, IHeaderCommandBarItem, HeaderCommandBarWithFilter } from 'azure-devops-ui/HeaderCommandBar';
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { Status, Statuses, StatusSize, IStatusProps } from 'azure-devops-ui/Status';
import { MenuItemType } from 'azure-devops-ui/Menu';
import { SurfaceBackground, SurfaceContext, Surface } from "azure-devops-ui/Surface";
import { FilterBar } from "azure-devops-ui/FilterBar";
import { DropdownFilterBarItem } from "azure-devops-ui/Dropdown";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { TabBar, Tab } from 'azure-devops-ui/Tabs';
import { Filter } from 'azure-devops-ui/Utilities/Filter';
import { DropdownMultiSelection } from "azure-devops-ui/Utilities/DropdownSelection";
import { IListBoxItem } from 'azure-devops-ui/ListBox';

import { css } from "azure-devops-ui/Util";

enum PipelineStatus {
    running = "running",
    succeeded = "succeeded",
    failed = "failed",
    warning = "warning"
}

interface IBuildPipelines {

}

interface IBuildPipelinesProps {
    azDoService: IAzDoService
}

const filterToggled = new ObservableValue<boolean>(false);
const selectedTabId = new ObservableValue<string>("home");
const filter = new Filter();
const dropdownSelection = new DropdownMultiSelection();

const commandBarItemsAdvanced: IHeaderCommandBarItem[] = [
    {
        iconProps: {
            iconName: "Download"
        },
        id: "testSave",
        important: true,
        onActivate: () => {
            alert("Example text");
        },
        text: "Download"
    },
    {
        iconProps: {
            iconName: "Share"
        },
        id: "testShare",
        onActivate: () => {
            alert("Example text");
        },
        text: "Share"
    },
    {
        iconProps: {
            iconName: "Add"
        },
        id: "testCreate",
        important: true,
        isPrimary: true,
        onActivate: () => {
            alert("This would normally trigger a modal popup");
        },
        text: "Add"
    },
    {
        iconProps: {
            iconName: "FavoriteStar"
        },
        id: "testCreate",
        important: false,
        onActivate: () => {
            alert("This would normally trigger a modal popup");
        },
        text: "Add to favorites"
    },
    {
        iconProps: {
            iconName: "CheckMark"
        },
        id: "testCreate",
        important: false,
        onActivate: () => {
            alert("This would normally trigger a modal popup");
        },
        text: "Approve item"
    },
    { id: "separator", itemType: MenuItemType.Divider },
    {
        iconProps: {
            iconName: "Delete"
        },
        id: "testDelete",
        onActivate: () => {
            alert("Example text");
        },
        text: "Delete",
    }
];

const pipelineSetupCommandBarItems: IHeaderCommandBarItem[] = [
    {
        iconProps: {
            iconName: "TriggerAuto"
        },
        id: "rescan",
        important: true,
        isPrimary: true,
        onActivate: () => {
            alert("Example text");
        },
        text: "Rescan"
    }
];

export default class extends React.Component<IBuildPipelinesProps, { report: IBuildPipelines, isLoading: boolean }> {

    constructor(props: IBuildPipelinesProps) {
        super(props);

        this.state = {
            report: {
                reports: []
            },
            isLoading: true
        }
    }

    private renderStatus = (className?: string) => {
        return <Status {...Statuses.Success} className={className} size={StatusSize.l} />;
    };

    private getStatuses = () => {
        return [
            PipelineStatus.succeeded,
            PipelineStatus.failed,
            PipelineStatus.warning,
            PipelineStatus.running
        ];
    };

    private getStatusListItem = (status: PipelineStatus): IListBoxItem<PipelineStatus> => {
        const statusDetail = getStatusIndicatorData(status);

        return {
            data: status,
            id: status,
            text: statusDetail.label,
            iconProps: {
                render: className => (
                    <Status
                        {...statusDetail.statusProps}
                        className={css(className, statusDetail.statusProps.className)}
                        size={StatusSize.m}
                        animated={false}
                    />
                )
            }
        };
    };

    private onSelectedTabChanged = (newTabId: string) => {
        selectedTabId.value = newTabId;
    };

    private onFilterBarDismissClicked = () => {
        filterToggled.value = !filterToggled.value;
    };

    private renderTabBarCommands = () => {
        return (
            <HeaderCommandBarWithFilter
                filter={filter}
                filterToggled={filterToggled}
                items={[]}
            />
        );
    };

    render() {
        return (
            <Surface background={SurfaceBackground.neutral} >
                <Page className="flex-grow">
                    <CustomHeader className="bolt-header-with-commandbar">
                        <HeaderIcon
                            className="bolt-table-status-icon-large"
                            iconProps={{ render: this.renderStatus }}
                            titleSize={TitleSize.Large}
                        />
                        <HeaderTitleArea>
                            <HeaderTitleRow>
                                <HeaderTitle className="text-ellipsis" titleSize={TitleSize.Large}>
                                    Pipeline compliancy
                                </HeaderTitle>
                            </HeaderTitleRow>
                            <HeaderDescription>
                                Last scanned: today at 6:27 pm
                            </HeaderDescription>
                        </HeaderTitleArea>
                        <HeaderCommandBar items={pipelineSetupCommandBarItems} />
                    </CustomHeader>

                    <TabBar
                        selectedTabId={selectedTabId}
                        onSelectedTabChanged={this.onSelectedTabChanged}
                        renderAdditionalContent={this.renderTabBarCommands}
                        disableSticky={false}
                    >
                        <Tab id="home" name="Home" />
                        <Tab id="pipeline" name="Pipeline" />
                        <Tab id="builds" name="Builds" />
                    </TabBar>

                    <ConditionalChildren renderChildren={filterToggled}>
                        <div className="page-content-left page-content-right page-content-top">
                            <FilterBar
                                filter={filter}
                                onDismissClicked={this.onFilterBarDismissClicked}
                            >
                                <KeywordFilterBarItem filterItemKey="keyword" />
                                <DropdownFilterBarItem
                                    filterItemKey="status"
                                    filter={filter}
                                    items={this.getStatuses().map(this.getStatusListItem)}
                                    selection={dropdownSelection}
                                    placeholder="Status"
                                />
                            </FilterBar>
                        </div>
                    </ConditionalChildren>

                    <div className="page-content page-content-top">

                    </div>
                </Page>
            </Surface>
        );
    }
}

interface IStatusIndicatorData {
    statusProps: IStatusProps;
    label: string;
}

function getStatusIndicatorData(status: string): IStatusIndicatorData {
    status = status || "";
    status = status.toLowerCase();
    let indicatorData: IStatusIndicatorData = {
        statusProps: Statuses.Success,
        label: "Success"
    };
    switch (status) {
        case PipelineStatus.failed:
            indicatorData.statusProps = Statuses.Failed;
            indicatorData.label = "Failed";
            break;
        case PipelineStatus.running:
            indicatorData.statusProps = Statuses.Running;
            indicatorData.label = "Running";
            break;
        case PipelineStatus.warning:
            indicatorData.statusProps = Statuses.Warning;
            indicatorData.label = "Warning";

            break;
    }

    return indicatorData;
}