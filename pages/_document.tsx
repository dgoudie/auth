import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html
            data-color-mode='auto'
            data-light-theme='light'
            data-dark-theme='dark'
        >
            <Head>
                <link
                    rel='icon'
                    href='https://cdn.goudie.dev/images/goudie.dev.favicon.ico'
                />
                <meta name='color-scheme' content='light dark'></meta>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
