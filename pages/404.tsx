import Error from 'next/error';
import { NextPage } from 'next';

const Custom404: NextPage = () => {
    return <Error statusCode={404} title={`Page not found`} />;
};

export default Custom404;
