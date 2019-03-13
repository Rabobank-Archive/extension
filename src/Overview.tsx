import * as React from 'react';
import SecurityReport, { INamespace } from './components/SecurityReport';


export default class extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    render() {
        const dummy: INamespace[] = [{
           key:"key",
           name :"Global Project Permissions (sampledata)",
           description:"Global Project Permissions",
           applicationGroups: [
               {
                   name: "[Sample Project]\\Rabobank Project Administrators",
                   permissions: [
                    {
                        Bit: "1:Bypass rules on work item updates",
                        ActualValue: 1,
                        ShouldBe: 1,
                        IsCompliant: true
                    },
                    {
                        Bit: "2:Change process of team project.",
                        ActualValue: 2,
                        ShouldBe: 2,
                        IsCompliant: true
                    },
                    {
                        Bit: "4:Create tag definition ",
                        ActualValue: 3,
                        ShouldBe: 3,
                        IsCompliant: true
                    },
                    {
                        Bit: "8:Create test runs ",
                        ActualValue: 4,
                        ShouldBe: 4,
                        IsCompliant: true
                    },
                       {
                           Bit: "16: Delete and restore work item",
                           ActualValue: 1,
                           ShouldBe: 2,
                           IsCompliant: false
                       },
                       {
                           Bit: "32: Delete shared Analytics views",
                           ActualValue: 2,
                           ShouldBe: 1,
                           IsCompliant: false
                       },
                       {
                           Bit: "64: Delete team project ",
                           ActualValue: 0,
                           ShouldBe: 0,
                           IsCompliant: true
                       },
                       {
                        Bit: "128: Delete test runs ",
                        ActualValue: 0,
                        ShouldBe: 0,
                        IsCompliant: true
                    },
                    {
                     Bit: "256: Edit project-level information ",
                     ActualValue: 0,
                     ShouldBe: 0,
                     IsCompliant: true
                 },
                 {
                  Bit: "512: Edit shared Analytics views",
                  ActualValue: 0,
                  ShouldBe: 0,
                  IsCompliant: true
              },
              {
               Bit: "1024: Manage project properties",
               ActualValue: 0,
               ShouldBe: 0,
               IsCompliant: true
           },
           {
            Bit: "2056: Manage test configurations",
            ActualValue: 0,
            ShouldBe: 0,
            IsCompliant: true
        },
        {
         Bit: "8: Manage test environments",
         ActualValue: 0,
         ShouldBe: 0,
         IsCompliant: true
     },
     {
      Bit: "8: Move work items out of this project",
      ActualValue: 0,
      ShouldBe: 0,
      IsCompliant: true
    },
    {
     Bit: "8: Permanently delete work items",
     ActualValue: 0,
     ShouldBe: 0,
     IsCompliant: true
    },
    ]
               },
               {
                   name: "[Sample Project]\\ Project Administrators",
                   permissions: [                   {
                    Bit: "9: Delete test runs ",
                    ActualValue: 0,
                    ShouldBe: 0,
                    IsCompliant: true
                }]
    
               },
               {
                   name: "[Sample Project]\\ Build Administrators",
                   permissions: [                   {
                    Bit: "10: Delete test runs ",
                    ActualValue: 0,
                    ShouldBe: 0,
                    IsCompliant: true
                }]
    
               },
               {
                   name: "[Sample Project]\\ Release Administrators",
                   permissions: [ 
                       {
                    Bit: "11: Delete test runs ",
                    ActualValue: 0,
                    ShouldBe: 0,
                    IsCompliant: true
                },         {
                    Bit: "12: Delete test runs ",
                    ActualValue: 0,
                    ShouldBe: 0,
                    IsCompliant: true
                },         {
                    Bit: "13: Delete test runs ",
                    ActualValue: 0,
                    ShouldBe: 0,
                    IsCompliant: true
                }]
    
               },
               {
                   name: "[Sample Project]\\ Project Administrators",
                   permissions: []
    
               }
           ]
       },
       {
           "key":"",
           name: "Repositories",
           description: "sdfs",
           applicationGroups: [
               {
                   name:"[Sample Project]\\Extra test team",
                   permissions: [                   {
                    Bit: "14: valt onder repositories ",
                    ActualValue: 0,
                    ShouldBe: 0,
                    IsCompliant: true
                }]
               }
           ]
       }
    ];
    


if(typeof VSS !== 'undefined')
{
    VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData).then((service) => {
        var context = VSS.getWebContext();
        
        if (context.collection.name === 'raboweb')
        {
            // We are in production!
            return (<div>&#9888; This page is work in progress &#9888;</div>)
        }
    })
}

return (
    <div>
        <div>
            <h1>Project compliancy</h1>
            <p>For feedback and questions, please contact the TAS team.</p>
            <p>More information on the <a href="https://confluence.dev.rabobank.nl/display/vsts/Azure+DevOps+Project+group+permissions" target="_blank">Azure Devops Project Group permissions</a> in general.</p>
        </div>
        <hr />
        <SecurityReport dummy={dummy} document="ProjectOverview"   />
      </div>)
 
}
}
