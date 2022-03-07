import type {
    GetServerSideProps,
    GetServerSidePropsResult,
    NextPage,
} from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import React, {
    SyntheticEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { handle, json, redirect } from 'next-runtime';

import { AUTH_COOKIE_NAME } from '../../constants';
import Head from 'next/head';
import User from '../../mongoose/User';
import { addMonths } from 'date-fns';
import { buildAuthToken } from '../../utils/jsonwebtoken';
import classNames from 'classnames';
import dbConnect from '../../mongoose/init';
import { performSHA256Hash } from '../../utils/sha256';
import { setCookies } from 'cookies-next';
import styles from './login.module.scss';

interface Props {
    origin: string;
    invalidCredentials: boolean;
    isLogoutAction: boolean;
}

const Login: NextPage<Props> = ({
    origin,
    invalidCredentials,
    isLogoutAction,
}) => {
    const [submitted, setSubmitted] = useState(false);

    const [showInvalidCredsMessage, setShowInvalidCredsMessage] =
        useState(invalidCredentials);
    const [showLogoutSuccessMessage, setShowLogoutSuccessMessage] =
        useState(isLogoutAction);

    const emailInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        emailInputRef.current?.focus();
    }, []);

    const onSubmit = useCallback(() => {
        setSubmitted(true);
        setShowInvalidCredsMessage(false);
        setShowLogoutSuccessMessage(false);
    }, [setSubmitted, setShowInvalidCredsMessage, setShowLogoutSuccessMessage]);

    return (
        <React.Fragment>
            <Head>
                <title>Login | {origin}</title>
            </Head>
            <div className={classNames('container', styles.container)}>
                <div className='block'></div>
                <div className='block'>
                    <div className='is-size-3 is-size-4-mobile has-text-centered'>
                        Sign in to {origin}
                    </div>
                </div>
                {showInvalidCredsMessage && (
                    <article
                        className={classNames(
                            'message is-danger',
                            styles.message
                        )}
                    >
                        <div className='message-body'>
                            Email or password is invalid.
                        </div>
                    </article>
                )}
                {showLogoutSuccessMessage && (
                    <article
                        className={classNames(
                            'message is-success',
                            styles.message
                        )}
                    >
                        <div className='message-body'>
                            Logged out successfully.
                        </div>
                    </article>
                )}
                <form className='box' method='POST' onSubmit={onSubmit}>
                    <div className='field'>
                        <label className='label' htmlFor='email-address'>
                            Email
                        </label>
                        <div className='control'>
                            <input
                                ref={emailInputRef}
                                name='email'
                                id='email-address'
                                className='input'
                                type='email'
                                placeholder='e.g. alexsmith@gmail.com'
                                autoFocus
                                required
                            />
                        </div>
                    </div>
                    <div className='field'>
                        <label className='label' htmlFor='password'>
                            Password
                        </label>
                        <div className='control'>
                            <input
                                className='input'
                                name='password'
                                id='password'
                                type='password'
                                required
                            />
                        </div>
                    </div>
                    <div className={styles.buttonBar}>
                        <button
                            className={'button '}
                            type='reset'
                            onClick={() => emailInputRef.current?.focus()}
                        >
                            Reset
                        </button>
                        <button
                            className={classNames(
                                'button is-primary',
                                submitted && 'is-loading'
                            )}
                            type='submit'
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
};

export default Login;

export const getServerSideProps = handle<Props>({
    async get({ query }) {
        return json({
            origin: process.env.ORIGIN!,
            invalidCredentials: false,
            isLogoutAction: !!query!['logout_action'],
        });
    },

    async post({ req, res, query }) {
        const { email, password } = req.body;
        if (!requestIsValid(email, password)) {
            return json({
                origin: process.env.ORIGIN!,
                invalidCredentials: false,
                isLogoutAction: !!query!['logout_action'],
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
                path: '/',
                secure: true,
            });
            const redirectUri = decodeURIComponent(
                query!['redirect_uri'] as string
            );
            return redirect(redirectUri);
        } else {
            return json({
                origin: process.env.ORIGIN!,
                invalidCredentials: true,
                isLogoutAction: !!query!['logout_action'],
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
