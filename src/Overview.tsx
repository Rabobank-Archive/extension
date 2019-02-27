import * as React from 'react';
import moment from 'moment';
import Permission from './components/Permission';
import Checkmark from './components/Checkmark';
import Report from './components/Report';

interface IReport {
    namespace: string,
    applicationGroup: string,
    level: string,
    permission: string,
    actualValue: number,
    shouldBe: number,
    IsCompliant: boolean,
}

export default class extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    render() {
      const columns = [{
          key: 'column1',
          name: 'Namespace',
          fieldName: 'namespace',
          minWidth: 150,
          maxWidth: 400,
          isResizable: true,
          groupAriaLabel: 'Namespace',
      },
      {
          key: 'column2',
          fieldName: 'applicationGroupName',
          name: 'Application Group',
          minWidth: 50,
          maxWidth: 250,
          isResizable: true,
      },
      {
        key: 'column3',
        fieldName: 'level',
        name: 'Level',
        minWidth: 50,
        maxWidth: 100,
        isResizable: true,
        data: Boolean,
    },
    {
        key: 'column4',
        fieldName: 'permission',
        name: 'Permission',
        minWidth: 50,
        maxWidth: 250,
        isResizable: true,
        
    },
    {
        key: 'column5',
        fieldName: 'actualValue',
        name: 'Actual value',
        minWidth: 50,
        maxWidth: 100,
        isResizable: true,
        onRender: (item: IReport) => <Permission value={item.actualValue} />

    },
    {
        key: 'column6',
        fieldName: 'shouldBe',
        name: 'Should Be',
        minWidth: 50,
        maxWidth: 100,
        isResizable: true,
        onRender: (item: IReport) => <Permission value={item.shouldBe} />

    },
    {
        key: 'column7',
        fieldName: 'isCompliant',
        name: 'Is compliant?',
        minWidth: 50,
        maxWidth: 250,
        isResizable: true,
        data: Boolean,
        onRender: (item: IReport) => <Checkmark checked={item.IsCompliant} />
    }];

   
    const dummy = [{
        "namespace":"GlobalPermissions",
        "PermissionBit": 1,
        "permission": "Permanently Delete Work Items",
        "actualValue": 3,
        "shouldBe": 1,
        "IsCompliant": true,
        "Level":"",
        "applicationGroupName": "Production Environment Owner",
    },
    {
        "namespace":"GlobalPermissions",
        "PermissionBit": 1,
        "permission": "Manage Project Properties",
        "actualValue": 2,
        "shouldBe": 2,
        "IsCompliant": true,
        "Level":"",
        "applicationGroupName": "Production Environment Owner",
    },
    {
        "namespace":"GlobalPermissions",
        "PermissionBit": 1,
        "permission": "Rename team project",
        "actualValue": 0,
        "shouldBe": 0,
        "IsCompliant": true,
        "Level":"",
        "applicationGroupName": "Production Environment Owner",
    },
];


if(typeof VSS !== 'undefined' && VSS.getWebContext().collection.name === 'raboweb')
{
    /// We are in production!
    return (<div>&#9888; This page is work in progress &#9888;</div>)
}
else 
{
      return (<div>
          <div>
              <h1>Project compliancy</h1>
              <p>For feedback and questions, please contact the TAS team.</p>
              <p>More information on the <a href="https://confluence.dev.rabobank.nl/display/vsts/Azure+DevOps+Project+group+permissions" target="_blank">Azure Devops Project Group permissions</a> in general.</p>
          </div>
          <hr />
          <Report columns={columns} document="CompliancyOverview" dummy={dummy}  />
        </div>)
    }
}
}

