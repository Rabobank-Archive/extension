import React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import App from './Repositories';
import { initializeIcons } from '@uifabric/icons';

const router = require('react-router-dom');
import Repositories from './Repositories';
import Releases from './Releases';

initializeIcons();

const route = (<router.BrowserRouter>
    <div>
        <router.Route path="/repositories" component={Repositories} />
        <router.Route path="/releases" component={Releases} />
    </div>
</router.BrowserRouter>);
ReactDOM.render(route, document.getElementById('root'));