import type { GetServerSideProps, NextPage } from 'next';
import React, { useMemo } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import { ServerResponse } from 'http';
import styles from './login.module.scss';

interface Props {
    redirectUri: string;
    origin: string;
}

const Login: NextPage<Props> = ({ redirectUri, origin }) => {
    const imageNumber = useMemo(
        () => Math.floor(Math.random() * (50 - 1 + 1) + 1),
        []
    );
    return (
        <React.Fragment>
            <Head>
                <title>Login | {origin}</title>
            </Head>
            <div className={styles.root}>
                <div className={styles.backgroundImage}>
                    <Image
                        src={`https://cdn.goudie.dev/images/bg/${imageNumber}.jpg`}
                        alt='Background'
                        layout='fill'
                    />
                </div>
            </div>
        </React.Fragment>
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
        return { props: { redirectUri, origin: process.env.ORIGIN! } };
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
    return { props: { redirectUri: 'N/A', origin: process.env.ORIGIN! } };
};
