 import * as React from 'react';
import Permission from './Permission';
import Checkmark from './Checkmark';

import { IStyle, DetailsList, DetailsListLayoutMode, SelectionMode, GroupedList, IGroup, IGroupDividerProps, IRenderFunction, IGroupHeaderProps} from 'office-ui-fabric-react';


export interface IPermission {
  bit : string,
  actualValue : Number,
  shouldBe :Number,
  isCompliant : boolean,
}

export interface IApplicationGroup {
  name: string,
  permissions: IPermission[],
}

export interface INamespace {
  key: string,
  name: string,
  description: string,
  applicationGroups: IApplicationGroup[],
} 

interface IReportProperties<TReport> {
  document: string,
  dummy: INamespace[]
}

interface IState<TReport> {
  namespaces: INamespace[],
  error: string,
  groups: IGroup[],
}


const columns= [{
  key: 'column0',
  fieldName: 'Empty',
  name: '',
  minWidth: 250,
  maxWidth: 400,
  isResizable: true,
},
{
  key: 'column1',
  fieldName: 'bit',
  name: 'Permission description',
  minWidth: 200,
  maxWidth: 500,
  isResizable: true,
},
{
  key: 'column2',
  fieldName: 'actualValue',
  name: 'Actual value',
  minWidth: 100,
  maxWidth: 100,
  isResizable: true,
  onRender: (item: IPermission) => <Permission value={item.actualValue}  />

},
{
  key: 'column3',
  fieldName: 'shouldBe',
  name: 'Should be',
  minWidth: 100,
  maxWidth: 100,
  isResizable: true,
  onRender: (item: IPermission) => <Permission value={item.shouldBe}  />
},
{
  key: 'column4',
  fieldName: 'isCompliant',
  name: 'Is compliant ?',
  minWidth: 50,
  maxWidth: 100,
  isResizable: true,
  onRender: (item: IPermission) => <Checkmark checked={item.isCompliant}  />

}]; 

const styles = {
  root: {
    backgroundColor: 'red'
  }
};
export default class A<TReport> extends React.Component<IReportProperties<TReport>, IState<TReport>> {
  constructor(props: IReportProperties<TReport>) {
    super(props);
    
      this.state = {
        namespaces: [],
        error: '',
        groups:  [],
      };
    }
  
    
  componentDidMount() {
    if (typeof VSS !== 'undefined') {
      VSS.getService<IExtensionDataService>(VSS.ServiceIds.ExtensionData).then((service) => {
          var context = VSS.getWebContext();

          console.log("collectionname: " + context.collection.name);

          service.getDocument(this.props.document, context.project.name)
              .then((doc: { namespaces: INamespace[]}) => 
              this.setState({ namespaces: doc.namespaces, groups: this._createNamespaces(doc.namespaces)}), 
              (err: Error) => this.setState({ error: err.message }))
              .then(() => VSS.notifyLoadSucceeded()).then(() => console.log('everything done now :D'));
              
      });
    } else {
        console.log('set dummy data')
        this.setState({ namespaces: this.props.dummy, groups: this._createNamespaces(this.props.dummy) })
   }
  }

  public render(): JSX.Element {

    let applicationGroups = this.state.namespaces.map((namespace) => 
    {
      return namespace.applicationGroups.map((app) => {
        return {
          name: app.name,
          permissions : app.permissions
        } 
      })
    }).reduce((a, b) =>
      a.concat(b),[]
    );

    
    return (
      <div >
      <span className="error">{this.state.error}</span>
      <GroupedList 
        items={applicationGroups}
        onRenderCell={this._onRenderCell}
        groups={this.state.groups}
        groupProps={ {
          onRenderHeader: this.onRenderHeader,
          showEmptyGroups: true,
        } }
        />
        </div>
    );
  }

  private onRenderHeader(props?:IGroupDividerProps,defaultRender?:IRenderFunction<IGroupHeaderProps>) {

    const headerCountStyle:IStyle = { display: 'none' };
    return (
      <span>
        {defaultRender? 
          defaultRender({...props, styles: {headerCount: headerCountStyle  }}): 
        '' }
      </span>
    );
}

  private _onRenderCell(nestingDepth?: number, item?: any, itemIndex?: number): JSX.Element {
    return (<div >
      <DetailsList 
      items={item.permissions} 
      columns={columns} 
      layoutMode={DetailsListLayoutMode.justified} 
      selectionMode={SelectionMode.none}
      />
  </div> );
  }


 _createNamespaces( namespaces: INamespace[], level = 0, isCollapsed?:boolean)
:IGroup[] {

let counter = 0;

return namespaces.map(function (value, index) {
  
  let size = value.applicationGroups.length;
  counter = counter + size;
  let childGroups = A._createApplicationGroups(value.applicationGroups, counter - size);

  return {
        count: size,
        key: 'namespace_' + index,
        name: value.name,
        startIndex: counter,
        level: level,
        isCollapsed: isCollapsed,
        children: childGroups
    };
});
}



  public static _createApplicationGroups( groups :IApplicationGroup[], startIndex: number, isCollapsed?:boolean)
:IGroup[] {


return groups.map(function (value, index) {
  let count = 1;
  
  startIndex = startIndex +  count;  
  
  return {
        count: count,
        key: ''+ index,
        name: value.name,
        startIndex: startIndex - count,
        level: 2,
        isCollapsed: isCollapsed,
        children: []
    };
});
}

}