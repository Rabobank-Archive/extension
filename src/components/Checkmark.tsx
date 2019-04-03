import { Icon } from 'office-ui-fabric-react';
import * as React from 'react'
import './Checkmark.css'

interface ICheckmark {
    checked: boolean | null
}

export default class extends React.Component<ICheckmark, {}> {
    constructor(props: ICheckmark) {
        super(props);
    }

    public render() {

        switch(this.props.checked)
        {
            case true:
                return <Icon iconName="CheckMark" className="ms-IconExample" />;
            case false:
                return <Icon iconName="Cancel" className="ms-IconExample" />;
            case null:
            default:
                return <Icon iconName="Unknown" className="ms-IconExample" />;
        }
    }
}