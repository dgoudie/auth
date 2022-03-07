import type { GetServerSideProps, NextPage } from 'next';
import React, { SyntheticEvent, useCallback } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import { ServerResponse } from 'http';
import styles from './login.module.scss';

interface Props {
    redirectUri: string;
    origin: string;
    imageNumber: number;
}

const Login: NextPage<Props> = ({ redirectUri, origin, imageNumber }) => {
    const onFormSubmitError = useCallback((error: SyntheticEvent) => {
        console.log('error', error);
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>Login | {origin}</title>
            </Head>
            <div className={styles.formWrapper}>
                <div className={styles.formWrapperHeader}>
                    Sign in to {origin}
                </div>
                <form
                    className={styles.form}
                    method='POST'
                    action='/api/authenticate'
                    onError={onFormSubmitError}
                >
                    <input
                        name='redirectUri'
                        type='hidden'
                        value={redirectUri}
                    />
                    <label htmlFor='email-address'>Email address</label>
                    <input
                        name='email'
                        type='email'
                        id='email-address'
                        required
                        autoFocus
                    />
                    <label htmlFor='password'>Password</label>
                    <input
                        name='password'
                        type='password'
                        id='password'
                        required
                    />
                    <button type='submit'>Login</button>
                </form>
            </div>
        </React.Fragment>
    );
};

export default Login;

export const getServerSideProps: GetServerSideProps<Props> = async ({
    res,
    query,
}) => {
    const imageNumber = Math.floor(Math.random() * (24 - 1 + 1) + 1);
    let redirectUri = query?.['redirect_uri'];
    if (typeof redirectUri !== 'string') {
        return redirectWithDefaultRedirectUri(res, imageNumber);
    }
    redirectUri = decodeURIComponent(redirectUri).toLowerCase();
    try {
        const redirectUriHost = new URL(redirectUri).host;
        if (!redirectUriHost.endsWith(process.env.ORIGIN!)) {
            return redirectWithDefaultRedirectUri(res, imageNumber);
        }
        return {
            props: { redirectUri, origin: process.env.ORIGIN!, imageNumber },
        };
    } catch (e) {
        return redirectWithDefaultRedirectUri(res, imageNumber);
    }
};

const redirectWithDefaultRedirectUri = (
    res: ServerResponse,
    imageNumber: number
) => {
    res.writeHead(302, {
        location: `/login?redirect_uri=${encodeURIComponent(
            process.env.DEFAULT_REDIRECT_URL!
        )}`,
    }).end();
    return {
        props: { redirectUri: 'N/A', origin: process.env.ORIGIN!, imageNumber },
    };
};
