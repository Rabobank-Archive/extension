import * as React from 'react'

interface IPermission {
    value: Number
}

export default class extends React.Component<IPermission, {}> {
    constructor(props: IPermission) {
        super(props);
    }

    public render() {
         var text = "";
switch (this.props.value)
{
    case 0:
        text = "Not set";
        break;
    case 1:
        text = "Allow";
        break;
    case 2:
        text = "Deny";
        break;
    case 3:
        text = "Allow (Inherited)";
        break;
    case 4:
        text = "Deny (Inherited)";
        break;
}
return (<div>{text}</div>)
    }
}