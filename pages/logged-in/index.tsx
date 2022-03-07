import type { GetServerSideProps, NextPage } from 'next';
import { handle, json, redirect } from 'next-runtime';

import { AUTH_COOKIE_NAME } from '../../constants';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import styles from './logged-in.module.scss';

interface Props {
    origin: string;
}

const LoggedIn: NextPage<Props> = ({ origin }) => {
    return (
        <React.Fragment>
            <Head>
                <title>Login Successful | {origin}</title>
            </Head>
            <div className={styles.header}>You&apos;re logged in!</div>
        </React.Fragment>
    );
};

export default LoggedIn;

export const getServerSideProps = handle<Props>({
    async get({}) {
        return json({
            origin: process.env.ORIGIN!,
        });
    },
});
