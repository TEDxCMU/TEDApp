import React from 'react';
import Prismic from 'prismic-javascript';

import Client from '../utils/prismic';
import Schedule from '../components/Schedule';

function Home({ eventDate }) {
    return (
        <Schedule eventDate={eventDate} />
    );
}

export async function getStaticProps(context) {
    const req = context.req;
    const home = await Client(req).query(Prismic.Predicates.at('document.type', 'event'));
    return {
        props: { home },
    };
}

export default Home;
