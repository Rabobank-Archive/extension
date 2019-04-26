import * as React from 'react';
import { IAzDoService, IRepositoriesReport } from './services/IAzDoService';
import { Header, TitleSize } from 'azure-devops-ui/Header';
import { Card } from 'azure-devops-ui/Card';
import { Page } from 'azure-devops-ui/Page';
import { Link } from 'azure-devops-ui/Link';
import RepositoriesMasterDetail from './components/RepositoriesMasterDetail';
import { DummyRepositoriesReport } from './services/DummyData';

interface IRepositoriesProps {
    azDoService: IAzDoService
}

export default class extends React.Component<IRepositoriesProps, { isLoading: boolean, report: IRepositoriesReport }> {
    
    constructor(props: IRepositoriesProps) {
        super(props);
        this.state = {
            isLoading: true,
            report: {
                date: new Date(),
                reports: []
            }
        }
    }

    async componentDidMount() {
        const report = await this.props.azDoService.GetReportsFromDocumentStorage<IRepositoriesReport>("repository");
        
        this.setState({ isLoading: false, report: report });    
    }

    render() {
        return (
            <Page>
                <Header
                    title={"Repository compliancy"}
                    titleSize={TitleSize.Medium}
                    titleIconProps={{ iconName: "OpenSource" }}
                />
                <div className="page-content page-content-top">
                    <p>We would ❤ getting in touch on the pull request workflow, so join us on our <Link href="https://confluence.dev.rabobank.nl/display/MTTAS/Sprint+Review+Menu" target="_blank">sprint review</Link> @UC-T15!</p>
                    <p>More information on the <Link href="https://confluence.dev.rabobank.nl/pages/viewpage.action?pageId=119243814#ApplyDevOpsSecurityBlueprintCI/CDprinciples-Repositories" target="_blank">how &amp; why</Link> of branching policies with Azure Repos or <Link href="https://confluence.dev.rabobank.nl/display/MTTAS/Secure+Pipelines" target="_blank">secure pipelines</Link> in general.</p>
                    <p>If you still have questions or need assistance on your repositories, create a <Link href="http://tools.rabobank.nl/vsts/request" target="_blank">support request</Link>.</p>

                    <Card>
                        { this.state.isLoading ?
                            <div>Loading...</div> :
                            <RepositoriesMasterDetail data={this.state.report.reports}/>
                        }
                    </Card>
                </div>
            </Page>
        );
    }
}

