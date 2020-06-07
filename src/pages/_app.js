import { useEffect, Fragment } from 'react';
import Router from 'next/router';

import '../styles/global.css';
import Meta from '../components/Meta';
import * as gtag from '../utils/gtag';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        const handleRouteChange = url => {
            gtag.pageview(url);
        };
        Router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            Router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, []);

    return (
        <Fragment>
            <Meta />
            <Component {...pageProps} />
        </Fragment>
    );
}

export default MyApp;
