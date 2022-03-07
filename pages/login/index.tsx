import type {
    GetServerSideProps,
    GetServerSidePropsResult,
    NextPage,
} from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import React, { SyntheticEvent, useCallback } from 'react';
import { handle, json, redirect } from 'next-runtime';

import { AUTH_COOKIE_NAME } from '../../constants';
import Head from 'next/head';
import User from '../../mongoose/User';
import { addMonths } from 'date-fns';
import { buildAuthToken } from '../../utils/jsonwebtoken';
import dbConnect from '../../mongoose/init';
import { performSHA256Hash } from '../../utils/sha256';
import { setCookies } from 'cookies-next';
import styles from './login.module.scss';

interface Props {
    redirectUri: string;
    origin: string;
    invalidCredentials: boolean;
}

const Login: NextPage<Props> = ({
    redirectUri,
    origin,
    invalidCredentials,
}) => {
    return (
        <React.Fragment>
            <Head>
                <title>Login | {origin}</title>
            </Head>
            <div className={styles.formWrapper}>
                <div className={styles.formWrapperHeader}>
                    Sign in to {origin}
                </div>
                <form className={styles.form} method='POST'>
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

export const getServerSideProps = handle<Props>({
    async get({ query }) {
        const redirectUri = query!['redirect_uri'] as string;
        return json({
            redirectUri,
            origin: process.env.ORIGIN!,
            invalidCredentials: false,
        });
    },

    async post({ req, res, query }) {
        const redirectUri = query!['redirect_uri'] as string;
        const { email, password } = req.body;
        if (!requestIsValid(email, password)) {
            return json({
                redirectUri,
                origin: process.env.ORIGIN!,
                invalidCredentials: false,
            });
        }
        const user = await lookupUser(email as string, password as string);
        if (!!user) {
            const expires = addMonths(new Date(), 1);
            const token = buildAuthToken(user, expires);
            setCookies(AUTH_COOKIE_NAME, token, {
                expires,
                req,
                res,
                httpOnly: true,
                domain:
                    process.env.NODE_ENV === 'development'
                        ? undefined
                        : process.env.ORIGIN,
                secure: true,
            });
            return redirect(redirectUri);
        } else {
            return json({
                redirectUri,
                origin: process.env.ORIGIN!,
                invalidCredentials: true,
            });
        }
    },
});

const lookupUser = async (emailAddress: string, password: string) => {
    const passwordHashSHA256 = performSHA256Hash(password);
    await dbConnect();
    return await User.findOne({
        emailAddress,
        passwordHashSHA256,
    })
        .select('-passwordHashSHA256')
        .exec();
};

const requestIsValid = (email: any, password: any) => {
    if (typeof email !== 'string') {
        return false;
    }
    if (typeof password !== 'string') {
        return false;
    }
    if (!email.length) {
        return false;
    }
    if (!password.length) {
        return false;
    }
    return true;
};
