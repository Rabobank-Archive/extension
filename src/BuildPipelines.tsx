import * as React from 'react';
import { IAzDoService, IBuildPipelineSetupReport } from './services/IAzDoService';
import { Page } from 'azure-devops-ui/Page';
import { CustomHeader, HeaderIcon, TitleSize, HeaderTitleArea, HeaderTitleRow, HeaderTitle, HeaderDescription } from 'azure-devops-ui/Header';
import { HeaderCommandBar, HeaderCommandBarWithFilter } from 'azure-devops-ui/HeaderCommandBar';
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { Status, Statuses, StatusSize } from 'azure-devops-ui/Status';
import { SurfaceBackground, Surface } from "azure-devops-ui/Surface";
import { FilterBar } from "azure-devops-ui/FilterBar";
import { DropdownFilterBarItem } from "azure-devops-ui/Dropdown";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { TabBar, Tab } from 'azure-devops-ui/Tabs';
import { Filter } from 'azure-devops-ui/Utilities/Filter';
import { DropdownMultiSelection } from "azure-devops-ui/Utilities/DropdownSelection";

import { Ago } from 'azure-devops-ui/Ago';
import { AgoFormat } from 'azure-devops-ui/Utilities/Date';
import BuildPipelinesList from './components/BuildPipelinesList';
import PipelineMasterDetail from './components/RepositoriesMasterDetail'
import { getPossibleCompliancyStatuses, getCompliancyStatusAsListItem } from './components/CompliancyStatus';

interface IBuildPipelinesProps {
    azDoService: IAzDoService
}

const filterToggled = new ObservableValue<boolean>(false);

const filter = new Filter();
const pipelineSetupDropdownSelection = new DropdownMultiSelection();
const lastRunDropdownSelection = new DropdownMultiSelection();

interface IState {
    isLoading: boolean;
    isRescanning: boolean;
    pipelineSetupReport: IBuildPipelineSetupReport;
    hasReconcilePermission: boolean;
    token: string;
    selectedTabId: string;
  }

export default class extends React.Component<IBuildPipelinesProps, IState> {

    constructor(props: IBuildPipelinesProps) {
        super(props);

        this.state = {
            pipelineSetupReport: {
                date: new Date()
            },
            isLoading: true,
            isRescanning: false,
            hasReconcilePermission: false,
            token: "",
            selectedTabId: "home"
        }
    }

    private async doRescanRequest(): Promise<void> {
    }

    private onSelectedTabChanged = (newTabId: string) => {
        this.setState({selectedTabId: newTabId});
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
                        iconProps={{ iconName: "OpenSource" }}
                        titleSize={TitleSize.Large}
                    />
                    <HeaderTitleArea>
                        <HeaderTitleRow>
                        <HeaderTitle
                            className="text-ellipsis"
                            titleSize={TitleSize.Large}
                        >
                            Build Compliancy
                            {this.state.isRescanning ? (
                            <Status
                                {...Statuses.Running}
                                key="scanning"
                                size={StatusSize.l}
                                text="Scanning..."
                            />
                            ) : (
                            ""
                            )}
                        </HeaderTitle>
                        </HeaderTitleRow>
                        <HeaderDescription>
                        Last scanned:{" "}
                        <Ago date={this.state.pipelineSetupReport.date} format={AgoFormat.Extended} />
                        </HeaderDescription>
                    </HeaderTitleArea>
                    <HeaderCommandBar
                        items={[
                        {
                            iconProps: { iconName: "TriggerAuto" },
                            id: "testCreate",
                            important: true,
                            disabled: this.state.isRescanning,
                            isPrimary: true,
                            onActivate: () => {
                            this.doRescanRequest();
                            },
                            text: "Rescan"
                        }
                        ]}
                    />
                    </CustomHeader>

                    <TabBar
                        selectedTabId={this.state.selectedTabId}
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
                                    filterItemKey="pipelineSetupStatus"
                                    filter={filter}
                                    items={getPossibleCompliancyStatuses().map(getCompliancyStatusAsListItem)}
                                    selection={pipelineSetupDropdownSelection}
                                    placeholder="Status"
                                />
                                <DropdownFilterBarItem
                                    filterItemKey="lastRunStatus"
                                    filter={filter}
                                    items={getPossibleCompliancyStatuses().map(getCompliancyStatusAsListItem)}
                                    selection={lastRunDropdownSelection}
                                    placeholder="Last Run Status"
                                />
                            </FilterBar>
                        </div>
                    </ConditionalChildren>

                    <div className="page-content page-content-top">
                        {this.getTabContent()}
                        
                    </div>
                </Page>
            </Surface>
        );
    }

    getTabContent(): React.ReactNode {
        const { selectedTabId } = this.state;

        switch(selectedTabId) {
            case "home":
                return (<BuildPipelinesList filter={filter} />);

            case "pipeline":
                return (<PipelineMasterDetail hasReconcilePermission={true} token="abcdef" data={pipelineDummyData} />);

            case "builds":
                return (<div>Build data here</div>);
        }
        
    }
}

const pipelineDummyData = [
    {
        item: "pipeline 1",
        rules: [

        ]
    }
]