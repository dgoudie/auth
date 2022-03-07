import '../styles/globals.scss';

import { SSRProvider, ThemeProvider, theme } from '@primer/react';

import type { AppProps } from 'next/app';
import deepmerge from 'deepmerge';

function MyApp({ Component, pageProps }: AppProps) {
    const customTheme = deepmerge(theme, {
        fonts: {
            normal: `'Roboto', san-serif`,
        },
    });
    return (
        <SSRProvider>
            <ThemeProvider
                colorMode='auto'
                theme={customTheme}
                preventSSRMismatch
            >
                <Component {...pageProps} />
            </ThemeProvider>
        </SSRProvider>
    );
}

export default MyApp;
