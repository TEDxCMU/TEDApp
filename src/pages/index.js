import React from 'react';

import Schedule from '../components/Schedule/Schedule';

function Home({ eventDate }) {
    return (
        <Schedule eventDate={eventDate} />
    );
}

export async function getStaticProps() {
    return {
        props: {
            eventDate: '2020-06-06T23:33:49-04:00',
        },
    };
}

export default Home;
