import type { GetServerSideProps, NextPage } from 'next';

import Head from 'next/head';
import Image from 'next/image';
import { ServerResponse } from 'http';
import styles from './logged-in.module.scss';
import { useMemo } from 'react';

const LoggedIn: NextPage = () => {
    return <div className={styles.div}></div>;
};

export default LoggedIn;
