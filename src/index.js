import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import createHistory from 'history/createBrowserHistory';

import './index.scss';
import App from './App';

ReactGA.initialize('UA-134356076-1');

const history = createHistory();
history.listen(location => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
});

ReactDOM.render(<App history={history}/>, document.getElementById('root'));
