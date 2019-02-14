import * as React from 'react';
import moment from 'moment';
import Checkmark from './components/Checkmark';
import Report from './components/Report';

interface IReport {
    repository: string,
    hasRequiredReviewerPolicy: boolean,
    date: string
}

export default class extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    render() {
      const columns = [{
          key: 'column1',
          fieldName: 'repository',
          name: 'Repository',
          minWidth: 250,
          maxWidth: 400,
          isResizable: true,
      },
      {
          key: 'column2',
          fieldName: 'hasRequiredReviewerPolicy',
          name: 'Required Reviewer Policy',
          minWidth: 50,
          maxWidth: 250,
          isResizable: true,
          data: Boolean,
          onRender: (item: IReport) => <Checkmark checked={item.hasRequiredReviewerPolicy} />
      },
      {
          key: 'column3',
          fieldName: 'date',
          name: 'Checked',
          minWidth: 50,
          isResizable: true,
          onRender: (item: IReport) => <div>{moment(item.date).fromNow()}</div>
      }];

      const dummy = [{
        "repository": "investment-application-messages",
        "hasRequiredReviewerPolicy": true,
        "date": "2019-02-07T18:30:56.0654773+00:00"
      },
      {
        "repository": "rbo-feature-settings-ked",
        "hasRequiredReviewerPolicy": true,
        "date": "2019-02-07T18:30:56.0654773+00:00"
      }];

      return (<Report columns={columns} document="GitRepositories" dummy={dummy}  />)
    }
}

