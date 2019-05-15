import fetchMock from 'fetch-mock';
import { cleanup } from 'react-testing-library';

afterEach(fetchMock.reset);
afterEach(cleanup);

jest.setTimeout(10e3);
