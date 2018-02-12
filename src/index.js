import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'common/style/index.less';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
