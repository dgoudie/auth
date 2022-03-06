import type { GetServerSideProps, NextPage } from 'next';

import Head from 'next/head';
import Image from 'next/image';
import { ServerResponse } from 'http';
import styles from './login.module.scss';
import { useMemo } from 'react';

interface Props {
    redirectUri: string;
}

const Login: NextPage<Props> = ({ redirectUri }) => {
    const imageNumber = useMemo(
        () => Math.floor(Math.random() * (50 - 1 + 1) + 1),
        []
    );
    return (
        <div className={styles.root}>
            <div className={styles.backgroundImage}>
                <Image
                    src={`https://cdn.goudie.dev/images/bg/${imageNumber}.jpg`}
                    alt='Background'
                    layout='fill'
                />
            </div>
        </div>
    );
};

export default Login;

export const getServerSideProps: GetServerSideProps<Props> = async ({
    res,
    query,
}) => {
    let redirectUri = query?.['redirect_uri'];
    if (typeof redirectUri !== 'string') {
        return redirectWithDefaultRedirectUri(res);
    }
    redirectUri = decodeURIComponent(redirectUri).toLowerCase();
    try {
        const redirectUriHost = new URL(redirectUri).host;
        if (!redirectUriHost.endsWith(process.env.ORIGIN!)) {
            return redirectWithDefaultRedirectUri(res);
        }
        return { props: { redirectUri } };
    } catch (e) {
        return redirectWithDefaultRedirectUri(res);
    }
};

const redirectWithDefaultRedirectUri = (res: ServerResponse) => {
    res.writeHead(302, {
        location: `/login?redirect_uri=${encodeURIComponent(
            process.env.DEFAULT_REDIRECT_URL!
        )}`,
    }).end();
    return { props: { redirectUri: 'N/A' } };
};
