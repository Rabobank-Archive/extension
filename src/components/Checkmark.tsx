import { Icon } from 'office-ui-fabric-react';
import * as React from 'react'
import './Checkmark.css'

interface ICheckmark {
    checked: boolean
}

export default class extends React.Component<ICheckmark, {}> {
    constructor(props: ICheckmark) {
        super(props);
    }

    public render() {
        return ( this.props.checked ? 
            <Icon iconName="CheckMark" className="ms-IconExample" /> : 
            <Icon iconName="Cancel" className="ms-IconExample" />)
    }
}