import * as React from 'react';
import * as ReactDOM from 'react-dom';
import OverviewReport from './Overview';
import { DummyAzDoService } from "./services/DummyAzDoService";

describe('Overview', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render((<OverviewReport azDoService={ new DummyAzDoService() } />), div);
  });
});
