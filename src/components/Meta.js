import Head from 'next/head';

function Meta() {
    return (
        <Head>
            <meta key="charset" charSet="utf-8" />
            <meta key="viewport" name="viewport" content="width=device-width, shrink-to-fit=no, initial-scale=1,maximum-scale=1,user-scalable=0" />
            <meta key="theme-color" name="theme-color" content="#CB2D3E" />
            <meta key="apple-mobile-web-app-capable" name="apple-mobile-web-app-capable" content="yes" />
            <meta key="apple-mobile-web-app-status-bar-style" name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <meta key="apple-mobile-web-app-title" name="apple-mobile-web-app-title" content="TEDxCMU" />
            <meta key="author" name="author" content="TEDxCMU" />
            <meta key="description" name="description" content="TEDxCMU is a conference at Carnegie Mellon University that brings together some of the world’s most bold and innovative thinkers to give the talk of their lives. We want to spread great ideas to the Carnegie Mellon and Pittsburgh community and that starts with you attending this event!" />
            <meta key="keywords" name="keywords" content="ted, tedxcmu, ripple, synapse, carnegie mellon, cmu" />
            <meta key="open-graph-url" property="og:url" content="https://tedapp-git-develop.kazijawad.now.sh/" />
            <meta key="open-graph-title" property="og:title" content="TEDxCMU" />
            <meta key="open-graph-desc" property="og:description" content="TEDxCMU is a conference at Carnegie Mellon University that brings together some of the world’s most bold and innovative thinkers to give the talk of their lives. We want to spread great ideas to the Carnegie Mellon and Pittsburgh community and that starts with you attending this event!" />
            <meta key="open-graph-image" property="og:image" content="https://tedapp-git-develop.kazijawad.now.sh/icons/favicon.png" />
            <meta key="twitter-card" name="twitter:card" content="summary" />
            <meta key="twitter-site" name="twitter:site" content="@TEDxCMU" />
            <meta key="twitter-title" name="twitter:title" content="TEDxCMU" />
            <meta key="twitter-desc" name="twitter:description" content="TEDxCMU is a conference at Carnegie Mellon University that brings together some of the world’s most bold and innovative thinkers to give the talk of their lives. We want to spread great ideas to the Carnegie Mellon and Pittsburgh community and that starts with you attending this event!" />
            <meta key="twitter-image" name="twitter:image" content="https://tedapp-git-develop.kazijawad.now.sh/icons/favicon.png" />
            <title key="title">TEDxCMU</title>
            <link key="manifest" rel="manifest" href="/data/manifest.json" />
            <link key="favicon" rel="icon" href="/icons/favicon.png" importance="low" />
            <link key="favicon-192"rel="apple-touch-icon" sizes="192x192" href="/icons/favicon-192x192.png" />
            <link key="favicon-512" rel="apple-touch-icon" sizes="512x512" href="/icons/favicon-512x512.png" />
            <link key="apple-touch-icon" rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
            <link key="apple-touch-startup-image" rel="apple-touch-startup-image" href="/icons/favicon.png" />
        </Head>
    );
}

export default Meta;
