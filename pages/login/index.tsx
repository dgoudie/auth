import { Box, FormControl, Text, TextInput, useTheme } from '@primer/react';
import type { GetServerSideProps, NextPage } from 'next';
import React, { useMemo } from 'react';

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
    const { theme } = useTheme();
    return (
        <React.Fragment>
            <Head>
                <title>Login | {origin}</title>
            </Head>
            <Box maxWidth={540} mx='auto' mt='3rem'>
                <Text
                    as='div'
                    textAlign='center'
                    fontSize={3}
                    fontWeight='light'
                >
                    Sign in to {origin}
                </Text>
                <Box
                    as='form'
                    bg='canvas.subtle'
                    p={'1rem'}
                    mt='1rem'
                    display='grid'
                    gridGap={3}
                    borderRadius={8}
                    border='1px solid'
                    borderColor={theme!.colors.border.muted}
                >
                    <FormControl>
                        <FormControl.Label>Email address</FormControl.Label>
                        <TextInput type='email' autoFocus />
                    </FormControl>
                    <FormControl>
                        <FormControl.Label>Password</FormControl.Label>
                        <TextInput type='password' />
                    </FormControl>
                </Box>
            </Box>
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
