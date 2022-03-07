import type { GetServerSideProps, NextPage } from 'next';
import { handle, json, redirect } from 'next-runtime';

import Head from 'next/head';
import React from 'react';

interface Props {
    origin: string;
}

const LoggedIn: NextPage<Props> = ({ origin }) => {
    return (
        <React.Fragment>
            <Head>
                <title>Login Successful | {origin}</title>
            </Head>
            <div className={'container is-fluid'}>
                <div className='block'></div>
                <div className='block'>
                    <div className='is-size-3 is-size-4-mobile has-text-centered'>
                        You&apos;re logged in!
                    </div>
                </div>
                <div className='block is-flex is-justify-content-center'>
                    <a className='button is-info' href='/logout'>
                        Logout
                    </a>
                </div>
            </div>
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
