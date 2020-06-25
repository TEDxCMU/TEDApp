import Prismic from 'prismic-javascript';

const createClientOptions = (req = null, prismicAccessToken = null) => {
    const reqOption = req ? { req } : {};
    const accessTokenOption = prismicAccessToken ? { accessToken: prismicAccessToken } : {};
    return {
        ...reqOption,
        ...accessTokenOption,
    };
};

const Client = (req = null) => (
    Prismic.client(process.env.PRISMIC_API_ENDPOINT, createClientOptions(req, process.env.PRISMIC_ACCESS_TOKEN))
);

export default Client;
