import { useEffect } from 'react';
import Router from 'next/router';

import '../styles/global.css';
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
        <Component {...pageProps} />
    );
}

export default MyApp;
