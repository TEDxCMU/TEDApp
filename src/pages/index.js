import React from 'react';

import Client from '../utils/prismic';
import Schedule from '../components/Schedule';

function Home({ data }) {
    return (
        <Schedule data={data} />
    );
}

export async function getStaticProps(context) {
    const req = context.req;
    const data = await Client(req).getSingle('experience');
    return {
        props: { data },
    };
}

export default Home;
