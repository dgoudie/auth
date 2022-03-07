import type { GetServerSideProps, NextPage } from 'next';
import { handle, json, redirect } from 'next-runtime';
import { removeCookies, setCookies } from 'cookies-next';

import { AUTH_COOKIE_NAME } from '../../constants';
import Head from 'next/head';
import React from 'react';

interface Props {
    origin: string;
}

const Logout: NextPage<Props> = ({}) => {
    return <React.Fragment></React.Fragment>;
};

export default Logout;

export const getServerSideProps = handle<Props>({
    async get({ req, res }) {
        console.log('here');
        removeCookies(AUTH_COOKIE_NAME, { req, res });
        return redirect(`/login?logout_action=1`);
    },
});
