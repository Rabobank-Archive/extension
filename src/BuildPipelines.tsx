import * as React from "react";
import { IBuildPipelinesReport } from "./services/IAzDoService";
import { Page } from "azure-devops-ui/Page";
import {
    HeaderCommandBarWithFilter,
    HeaderCommandBar
} from "azure-devops-ui/HeaderCommandBar";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { SurfaceBackground, Surface } from "azure-devops-ui/Surface";
import { FilterBar } from "azure-devops-ui/FilterBar";
import { DropdownFilterBarItem } from "azure-devops-ui/Dropdown";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
// import { TabBar, Tab } from "azure-devops-ui/Tabs";
import { Filter } from "azure-devops-ui/Utilities/Filter";
import { DropdownMultiSelection } from "azure-devops-ui/Utilities/DropdownSelection";

import BuildPipelinesList from "./components/BuildPipelinesList";
import MasterDetail from "./components/MasterDetail";
import {
    getPossibleCompliancyStatuses,
    getCompliancyStatusAsListItem
} from "./components/CompliancyStatus";
import CompliancyHeader from "./components/CompliancyHeader";
import { Observer } from "azure-devops-ui/Observer";

import "./css/styles.css";
import { GetAzDoReportsFromDocumentStorage } from "./services/AzDoService";
import { HasReconcilePermission } from "./services/CompliancyCheckerService";
import { trackEvent, trackPageview } from "./services/ApplicationInsights";
import ErrorBar from "./components/ErrorBar";
import InfoBlock from "./components/InfoBlock";

interface IBuildPipelinesProps {}

const filterToggled = new ObservableValue<boolean>(false);
const allowFiltering = new ObservableValue<boolean>(true);

const filter = new Filter();
const pipelineSetupDropdownSelection = new DropdownMultiSelection();
const lastRunDropdownSelection = new DropdownMultiSelection();

interface IState {
    isLoading: boolean;
    isRescanning: boolean;
    buildPipelinesReport: IBuildPipelinesReport;
    hasReconcilePermission: boolean;
    selectedTabId: string;
    errorText: string;
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
            selectedTabId: "pipelines",
            errorText: ""
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
            <Observer allowFiltering={allowFiltering}>
                {allowFiltering.value ? (
                    <HeaderCommandBarWithFilter
                        filter={filter}
                        filterToggled={filterToggled}
                        items={[]}
                    />
                ) : (
                    <HeaderCommandBar items={[]} />
                )}
            </Observer>
        );
    };

    private async getData(): Promise<void> {
        try {
            const buildPipelinesReport = await GetAzDoReportsFromDocumentStorage<
                IBuildPipelinesReport
            >("buildpipelines");
            const hasReconcilePermission = await HasReconcilePermission(
                buildPipelinesReport.hasReconcilePermissionUrl
            );

            this.setState({
                isLoading: false,
                buildPipelinesReport: buildPipelinesReport,
                hasReconcilePermission: hasReconcilePermission,
                errorText: ""
            });
        } catch {
            this.setState({
                isLoading: false,
                errorText:
                    "Something went wrong while retrieving report data. Please try again later, or contact TAS if the issue persists."
            });
        }
    }

    async componentDidMount() {
        trackEvent("[Build Pipelines] Page opened");
        trackPageview();
        await this.getData();
    }

    render() {
        return (
            // @ts-ignore
            <Surface background={SurfaceBackground.neutral}>
                <Page className="flex-grow">
                    <CompliancyHeader
                        headerText="Build pipeline compliancy"
                        lastScanDate={this.state.buildPipelinesReport.date}
                        rescanUrl={this.state.buildPipelinesReport.rescanUrl}
                        onRescanFinished={async () => {
                            await this.getData();
                        }}
                    />

                    <ErrorBar
                        message={this.state.errorText}
                        onDismiss={() => this.setState({ errorText: "" })}
                    />

                    <InfoBlock showMoreInfoText={true} />

                    {/* <TabBar
            selectedTabId={this.state.selectedTabId}
            onSelectedTabChanged={this.onSelectedTabChanged}
            renderAdditionalContent={this.renderTabBarCommands}
            disableSticky={false}
          >
            <Tab id="home" name="Home" />
            <Tab id="pipelines" name="Pipelines" />
            <Tab id="builds" name="Builds" />
          </TabBar> */}

                    <ConditionalChildren renderChildren={filterToggled}>
                        <div className="page-content-left page-content-right page-content-top">
                            <FilterBar
                                filter={filter}
                                onDismissClicked={
                                    this.onFilterBarDismissClicked
                                }
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
                        {this.state.isLoading ? (
                            <div>Loading...</div>
                        ) : (
                            this.getTabContent()
                        )}
                    </div>
                </Page>
            </Surface>
        );
    }

    getTabContent(): React.ReactNode {
        const { selectedTabId } = this.state;

        switch (selectedTabId) {
            case "home":
                allowFiltering.value = true;
                return <BuildPipelinesList filter={filter} />;

            case "pipelines":
                // allowFiltering.value = false;
                // filterToggled.value = false;
                return (
                    <MasterDetail
                        title="Pipelines"
                        hasReconcilePermission={
                            this.state.hasReconcilePermission
                        }
                        data={this.state.buildPipelinesReport.reports}
                    />
                );

            case "builds":
                allowFiltering.value = false;
                filterToggled.value = false;
                return <div>Build data here</div>;

            default:
                return <div />;
        }
    }
}
