import { AppError } from '../errors/app-error';
import Error from 'next/error';
import { NextPage } from 'next';

interface Props {
    statusCode: number;
    message: string;
}

const ErrorPage: NextPage<Props> = ({ statusCode, message }) => {
    return <Error statusCode={statusCode} title={message} />;
};

ErrorPage.getInitialProps = ({ res, err }) => {
    if (err instanceof AppError) {
        return err;
    } else {
        return {
            statusCode: 500,
            message: 'An error occurred. Please try again later.',
        };
    }
};

export default ErrorPage;
