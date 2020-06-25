import React from 'react';

import Client from '../utils/prismic';

function Home() {
    return (
        <div>Test</div>
    );
}

export async function getStaticProps(context) {
    if (context.res) {
        context.res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    }

    const req = context.req;
    const data = await Client(req).getSingle('experience');
    return {
        props: { data },
    };
}

export default Home;
