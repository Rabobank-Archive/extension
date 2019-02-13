import { Icon } from 'office-ui-fabric-react';
import * as React from 'react'

export interface ICheckmark {
    checked: boolean
}

export default class extends React.Component<ICheckmark, {}> {
    constructor(props: ICheckmark) {
        super(props);
    }

    public render() {
        return ( this.props.checked ? <Icon iconName="CheckMark" className="ms-IconExample" /> : <Icon iconName="Cancel" className="ms-IconExample" />)
    }
}