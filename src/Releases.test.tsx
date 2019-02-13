import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Releases from './Releases';

describe('Releases', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render((<Releases />), div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
