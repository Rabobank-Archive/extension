import * as React from 'react';
import moment from 'moment';
import Checkmark from './components/Checkmark';
import Report from './components/Report';

interface IReport {
    id: string
    pipeline: string
    createdDate: string,
    artifactsStoredSecure: boolean
    usesFortify: boolean
    usesSonarQube: boolean
}

export default class extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }
    
    render() {
      const columns= [{
          key: 'column1',
          fieldName: 'pipeline',
          name: 'Pipeline',
          minWidth: 250,
          maxWidth: 400,
          isResizable: true,
      },
      {
          key: 'column2',
          fieldName: 'id',
          name: 'Build',
          minWidth: 50,
          maxWidth: 100,
          isResizable: true,
      },
      {
          key: 'column3',
          fieldName: 'createdDate',
          name: 'Created',
          minWidth: 50,
          maxWidth: 100,
          isResizable: true,
          onRender: (item: IReport) => <div>{moment(item.createdDate).fromNow()}</div>
      },
      {
          key: 'column4',
          fieldName: 'usesFortify',
          name: 'Fortify',
          minWidth: 50,
          maxWidth: 50,
          isResizable: true,
          data: Boolean,
          onRender: (item: IReport) => <Checkmark checked={item.usesFortify} />
      },
      {
          key: 'column5',
          fieldName: 'usesSonarQube',
          name: 'SonarQube',
          minWidth: 75,
          maxWidth: 75,
          isResizable: true,
          data: Boolean,
          onRender: (item: IReport) => <Checkmark checked={item.usesSonarQube} />
      },
      {
          key: 'column6',
          fieldName: 'artifactsStoredSecure',
          name: 'Artifacts Secure',
          minWidth: 50,
          maxWidth: 50,
          isResizable: true,
          data: Boolean,
          onRender: (item: IReport) => <Checkmark checked={item.artifactsStoredSecure} />
      }];
    
      const dummy: IReport[] =[{
        id: '1234',
        pipeline: 'auto-lst',
        createdDate: "2019-02-12T11:34:18.8188815Z",
        artifactsStoredSecure: true,
        usesFortify: false,
        usesSonarQube: true
      },
      {
        id: '2435',
        pipeline: 'auto-lst',
        createdDate: "2019-01-12T11:34:18.8188815Z",
        artifactsStoredSecure: true,
        usesFortify: false,
        usesSonarQube: true
      }];

      return (<div>
            <div>
                <h1>Build compliancy</h1>
                <p>We would ❤ getting in touch on how to improve analyzing builds and stuff, so join us on our <a href="https://confluence.dev.rabobank.nl/display/MTTAS/Sprint+Review+Menu" target="_blank">sprint review</a> @UC-T15!</p>
                <p>More information on the <a href="https://confluence.dev.rabobank.nl/pages/viewpage.action?pageId=119243814#ApplyDevOpsSecurityBlueprintCI/CDprinciples-Build" target="_blank">how &amp; why</a> of storing artifacts secure with Azure Pipelines or <a href="https://confluence.dev.rabobank.nl/display/MTTAS/Secure+Pipelines" target="_blank">secure pipelines</a> in general.</p>
                <p>If you still have questions or need assistance on your pipelines, create a <a href="http://tools.rabobank.nl/vsts/request" target="_blank">support request</a>.</p>
            </div>
            <Report columns={columns} document="BuildReports" dummy={dummy} />
        </div>);
    }  
}