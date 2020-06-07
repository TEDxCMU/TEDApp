import { useEffect } from 'react';
import Router from 'next/router';

import Page from '../components/Page';
import * as gtag from '../utils/gtag';

function MyApp({ Component, pageProps, router }) {
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
        <Page>
            <Component key={router.route} {...pageProps} />
        </Page>
    );
}

export default MyApp;
