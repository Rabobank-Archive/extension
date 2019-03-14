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
                        bit: "1:Bypass rules on work item updates",
                        actualValue: 1,
                        shouldBe: 1,
                        isCompliant: true
                    },
                    {
                        bit: "2:Change process of team project.",
                        actualValue: 2,
                        shouldBe: 2,
                        isCompliant: true
                    },
                    {
                        bit: "4:Create tag definition ",
                        actualValue: 3,
                        shouldBe: 3,
                        isCompliant: true
                    },
                    {
                        bit: "8:Create test runs ",
                        actualValue: 4,
                        shouldBe: 4,
                        isCompliant: true
                    },
                       {
                           bit: "16: Delete and restore work item",
                           actualValue: 1,
                           shouldBe: 2,
                           isCompliant: false
                       },
                       {
                           bit: "32: Delete shared Analytics views",
                           actualValue: 2,
                           shouldBe: 1,
                           isCompliant: false
                       },
                       {
                           bit: "64: Delete team project ",
                           actualValue: 0,
                           shouldBe: 0,
                           isCompliant: true
                       },
                       {
                        bit: "128: Delete test runs ",
                        actualValue: 0,
                        shouldBe: 0,
                        isCompliant: true
                    },
                    {
                     bit: "256: Edit project-level information ",
                     actualValue: 0,
                     shouldBe: 0,
                     isCompliant: true
                 },
                 {
                  bit: "512: Edit shared Analytics views",
                  actualValue: 0,
                  shouldBe: 0,
                  isCompliant: true
              },
              {
               bit: "1024: Manage project properties",
               actualValue: 0,
               shouldBe: 0,
               isCompliant: true
           },
           {
            bit: "2056: Manage test configurations",
            actualValue: 0,
            shouldBe: 0,
            isCompliant: true
        },
        {
         bit: "8: Manage test environments",
         actualValue: 0,
         shouldBe: 0,
         isCompliant: true
     },
     {
      bit: "8: Move work items out of this project",
      actualValue: 0,
      shouldBe: 0,
      isCompliant: true
    },
    {
     bit: "8: Permanently delete work items",
     actualValue: 0,
     shouldBe: 0,
     isCompliant: true
    },
    ]
               },
               {
                   name: "[Sample Project]\\ Project Administrators",
                   permissions: [                   {
                    bit: "9: Delete test runs ",
                    actualValue: 0,
                    shouldBe: 0,
                    isCompliant: true
                }]
    
               },
               {
                   name: "[Sample Project]\\ Build Administrators",
                   permissions: [                   {
                    bit: "10: Delete test runs ",
                    actualValue: 0,
                    shouldBe: 0,
                    isCompliant: true
                }]
    
               },
               {
                   name: "[Sample Project]\\ Release Administrators",
                   permissions: [ 
                       {
                    bit: "11: Delete test runs ",
                    actualValue: 0,
                    shouldBe: 0,
                    isCompliant: true
                },         {
                    bit: "12: Delete test runs ",
                    actualValue: 0,
                    shouldBe: 0,
                    isCompliant: true
                },         {
                    bit: "13: Delete test runs ",
                    actualValue: 0,
                    shouldBe: 0,
                    isCompliant: true
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
                    bit: "14: valt onder repositories ",
                    actualValue: 0,
                    shouldBe: 0,
                    isCompliant: true
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
