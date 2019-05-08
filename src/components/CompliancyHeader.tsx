import * as React from "react";
import {
  CustomHeader,
  HeaderIcon,
  TitleSize,
  HeaderTitleArea,
  HeaderTitleRow,
  HeaderTitle,
  HeaderDescription
} from "azure-devops-ui/Header";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { Ago } from "azure-devops-ui/Ago";
import { AgoFormat } from "azure-devops-ui/Utilities/Date";
import { HeaderCommandBar } from "azure-devops-ui/HeaderCommandBar";

interface ICompliancyHeaderProps {
  headerText: string;
  lastScanDate: Date;
  rescanUrl: string;
  token: string;
}

interface IState {
  isRescanning: boolean;
}

export default class extends React.Component<ICompliancyHeaderProps, IState> {
  constructor(props: ICompliancyHeaderProps) {
    super(props);
    this.state = {
      isRescanning: false
    };
  }

  private async doRescanRequest(): Promise<void> {
    try {
      let url = this.props.rescanUrl;
      this.setState({ isRescanning: true });
      let requestInit: RequestInit = {
        headers: { Authorization: `Bearer ${this.props.token}` }
      };
      let response = await fetch(url, requestInit);
      if (response.ok) {
        //await this.getReportdata();
        this.setState({ isRescanning: false });
      } else {
        this.setState({ isRescanning: false });
      }
    } catch {
      this.setState({ isRescanning: false });
    }
  }

  render() {
    return (
      <CustomHeader className="bolt-header-with-commandbar">
        <HeaderIcon
          className="bolt-table-status-icon-large"
          iconProps={{ iconName: "OpenSource" }}
          titleSize={TitleSize.Large}
        />
        <HeaderTitleArea>
          <HeaderTitleRow>
            <HeaderTitle className="text-ellipsis" titleSize={TitleSize.Large}>
              {this.props.headerText}
            </HeaderTitle>
          </HeaderTitleRow>
          <HeaderDescription>
            <div className="flex-row">
              {this.state.isRescanning ? (
                <div>
                  <Status
                    {...Statuses.Running}
                    key="scanning"
                    size={StatusSize.l}
                    text="Scanning..."
                  />
                </div>
              ) : (
                <div>
                  Last scanned:{" "}
                  <Ago
                    date={this.props.lastScanDate}
                    format={AgoFormat.Extended}
                  />
                </div>
              )}
              <div className="flex-grow" />
            </div>
          </HeaderDescription>
        </HeaderTitleArea>
        <HeaderCommandBar
          items={[
            {
              iconProps: { iconName: "TriggerAuto" },
              id: "rescan",
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
    );
  }
}
