import { Icon } from 'office-ui-fabric-react/lib';
import React = require("react");

export interface ICheckmark {
    checked: boolean
}

export class Checkmark extends React.Component<ICheckmark, null> {
    public render() {
        return ( this.props.checked ? <Icon iconName="CheckMark" className="ms-IconExample" /> : <Icon iconName="Cancel" className="ms-IconExample" />)
    }
}