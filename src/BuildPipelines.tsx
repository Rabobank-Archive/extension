import * as React from "react";
import { IAzDoService, IBuildPipelinesReport } from "./services/IAzDoService";
import { Page } from "azure-devops-ui/Page";
import {
  HeaderCommandBarWithFilter
} from "azure-devops-ui/HeaderCommandBar";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { SurfaceBackground, Surface } from "azure-devops-ui/Surface";
import { FilterBar } from "azure-devops-ui/FilterBar";
import { DropdownFilterBarItem } from "azure-devops-ui/Dropdown";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { TabBar, Tab } from "azure-devops-ui/Tabs";
import { Filter } from "azure-devops-ui/Utilities/Filter";
import { DropdownMultiSelection } from "azure-devops-ui/Utilities/DropdownSelection";

import BuildPipelinesList from "./components/BuildPipelinesList";
import PipelinesMasterDetail from "./components/RepositoriesMasterDetail";
import {
  getPossibleCompliancyStatuses,
  getCompliancyStatusAsListItem
} from "./components/CompliancyStatus";
import CompliancyHeader from "./components/CompliancyHeader";

interface IBuildPipelinesProps {
  azDoService: IAzDoService;
}

const filterToggled = new ObservableValue<boolean>(false);

const filter = new Filter();
const pipelineSetupDropdownSelection = new DropdownMultiSelection();
const lastRunDropdownSelection = new DropdownMultiSelection();

interface IState {
  isLoading: boolean;
  isRescanning: boolean;
  buildPipelinesReport: IBuildPipelinesReport;
  hasReconcilePermission: boolean;
  token: string;
  selectedTabId: string;
}

export default class extends React.Component<IBuildPipelinesProps, IState> {
  constructor(props: IBuildPipelinesProps) {
    super(props);

    this.state = {
      buildPipelinesReport: {
        date: new Date(),
        hasReconcilePermissionUrl: "",
        rescanUrl: "",
        reports: []
      },
      isLoading: true,
      isRescanning: false,
      hasReconcilePermission: false,
      token: "",
      selectedTabId: "home"
    };
  }

  private onSelectedTabChanged = (newTabId: string) => {
    this.setState({ selectedTabId: newTabId });
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

  private async getData(): Promise<void> {

  }

  render() {
    return (
      <Surface background={SurfaceBackground.neutral}>
        <Page className="flex-grow">
          <CompliancyHeader
            headerText="Repository compliance"
            lastScanDate={this.state.buildPipelinesReport.date}
            rescanUrl={this.state.buildPipelinesReport.rescanUrl}
            token={this.state.token}
            onRescanFinished={this.getData}
          />

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
                  items={getPossibleCompliancyStatuses().map(
                    getCompliancyStatusAsListItem
                  )}
                  selection={pipelineSetupDropdownSelection}
                  placeholder="Status"
                />
                <DropdownFilterBarItem
                  filterItemKey="lastRunStatus"
                  filter={filter}
                  items={getPossibleCompliancyStatuses().map(
                    getCompliancyStatusAsListItem
                  )}
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

    switch (selectedTabId) {
      case "home":
        return <BuildPipelinesList filter={filter} />;

      case "pipeline":
        return (
          <PipelinesMasterDetail
            hasReconcilePermission={true}
            token="abcdef"
            data={pipelineDummyData}
          />
        );

      case "builds":
        return <div>Build data here</div>;
    }
  }
}

const pipelineDummyData = [
  {
    item: "pipeline 1",
    rules: []
  }
];
