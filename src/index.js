import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from '@/store';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'common/style/index.less';
import FastClick from 'fastclick';

FastClick.attach(document.body);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
registerServiceWorker();
