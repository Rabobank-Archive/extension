import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Report from './Repositories';

describe('Repositories', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render((<Report />), div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
