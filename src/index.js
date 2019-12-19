import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import createHistory from 'history/createBrowserHistory';

import './index.scss';
import App from './App';
import registerServiceWorker from './serviceWorker';

ReactGA.initialize('UA-134356076-1');

const history = createHistory()
history.listen((location, action) => {  
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

ReactDOM.render(
    <App history={history}/>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
registerServiceWorker();
