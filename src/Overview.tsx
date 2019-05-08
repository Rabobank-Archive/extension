import * as React from "react";
import { IAzDoService, IOverviewReport } from "./services/IAzDoService";

import { ITableColumn, SimpleTableCell, Table } from "azure-devops-ui/Table";
import {
  ObservableValue,
  ObservableArray
} from "azure-devops-ui/Core/Observable";
import { Page } from "azure-devops-ui/Page";
import { Card } from "azure-devops-ui/Card";
import {
  Statuses,
  IStatusProps} from "azure-devops-ui/Status";
import {
  renderCheckmark,
  renderStringWithWhyTooltip
} from "./components/TableRenderers";
import { Link } from "azure-devops-ui/Link";
import { onSize } from "./components/TableBehaviors";
import ReconcileButton from "./components/ReconcileButton";

import CompliancyHeader from "./components/CompliancyHeader";

interface ITableItem {
  description: string;
  why: string;
  status: IStatusProps;
  hasReconcilePermission: boolean;
  reconcileUrl: string;
  reconcileImpact: string[];
  token: string;
}

interface IOverviewProps {
  azDoService: IAzDoService;
}

export default class extends React.Component<
  IOverviewProps,
  {
    report: IOverviewReport;
    isLoading: boolean;
    isRescanning: boolean;
    token: string;
  }
> {
  private itemProvider = new ObservableArray<ITableItem>();

  constructor(props: IOverviewProps) {
    super(props);
    this.state = {
      report: {
        date: new Date(0),
        reports: [],
        rescanUrl: "",
        hasReconcilePermissionUrl: ""
      },
      isLoading: true,
      isRescanning: false,
      token: ""
    };
  }

  private async getReportdata(): Promise<void> {
    const report = await this.props.azDoService.GetReportsFromDocumentStorage<
      IOverviewReport
    >("globalpermissions");
    const token = await this.props.azDoService.GetAppToken();

    let hasReconcilePermission: boolean = false;

    let requestInit: RequestInit = {
      headers: { Authorization: `Bearer ${token}` }
    };
    try {
      let response = await fetch(report.hasReconcilePermissionUrl, requestInit);
      let responseJson = await response.json();
      hasReconcilePermission = responseJson as boolean;
    } catch {
      // Don't do anything when this fails. Since by default user doesn't have permission to reconcile, this won't do any harm
    }

    this.itemProvider.removeAll();

    this.itemProvider.push(
      ...report.reports.map<ITableItem>(x => ({
        description: x.description,
        why: x.why,
        hasReconcilePermission: hasReconcilePermission,
        reconcileUrl: x.reconcile.url,
        reconcileImpact: x.reconcile.impact,
        status: x.status ? Statuses.Success : Statuses.Failed,
        token: token
      }))
    );

    this.setState({ isLoading: false, report: report, token: token });
  }

  async componentDidMount() {
    await this.getReportdata();
  }


  private renderReconcileButton(
    _rowIndex: number,
    columnIndex: number,
    tableColumn: ITableColumn<ITableItem>,
    item: ITableItem
  ): JSX.Element {
    let content =
      item.status != Statuses.Success && item.hasReconcilePermission ? (
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

  render() {
    const columns: ITableColumn<ITableItem>[] = [
      {
        id: "description",
        name: "Description",
        renderCell: renderStringWithWhyTooltip,
        onSize: onSize,
        width: new ObservableValue(450)
      },
      {
        id: "status",
        name: "Status",
        onSize: onSize,
        width: new ObservableValue(75),
        renderCell: renderCheckmark
      },
      {
        id: "reconcileUrl",
        name: "",
        onSize: onSize,
        width: new ObservableValue(130),
        renderCell: this.renderReconcileButton
      }
    ];

    return (
      <Page>
        <CompliancyHeader
          headerText="Project compliancy"
          lastScanDate={this.state.report.date}
          rescanUrl={this.state.report.rescanUrl}
          token={this.state.token}
          onRescanFinished={this.getReportdata}
        />

        <div className="page-content page-content-top">
          <p>
            We would ❤ getting in touch on how to have a secure setup that works
            out for you, so join us on our{" "}
            <Link
              href="https://confluence.dev.rabobank.nl/display/MTTAS/Sprint+Review+Menu"
              target="_blank"
            >
              bi-weekly sprint review
            </Link>{" "}
            @UC-T15!
          </p>
          <p>
            More information on the effective{" "}
            <Link
              href="https://confluence.dev.rabobank.nl/display/vsts/Azure+DevOps+Project+group+permissions"
              target="_blank"
            >
              Azure Devops Project group permissions
            </Link>{" "}
            that are used for the secure setup.
          </p>
          <Card>
            {this.state.isLoading ? (
              <div>Loading...</div>
            ) : (
              <div>
                <Table<ITableItem>
                  columns={columns}
                  itemProvider={this.itemProvider}
                  behaviors={[]}
                />
              </div>
            )}
          </Card>
        </div>
      </Page>
    );
  }
}
