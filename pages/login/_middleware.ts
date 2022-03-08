import { NextMiddleware, NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME } from '../../constants';
import { isValidAuthToken } from '../../utils/cloudflare-worker-jwt';

export const middleware: NextMiddleware = (req, ev) => {
    const token = req.cookies[AUTH_COOKIE_NAME];
    const isValid = isValidAuthToken(token);
    if (isValid) {
        return NextResponse.redirect(`${req.nextUrl.origin}/logged-in`);
    }
    const {
        nextUrl: { searchParams, origin },
    } = req;
    let redirectUri = searchParams.get('redirect_uri');
    if (!redirectUri) {
        return redirectWithDefaultUri(origin, searchParams);
    }
    redirectUri = decodeURIComponent(redirectUri).toLowerCase();
    try {
        const redirectUriHost = new URL(redirectUri).host;
        if (!redirectUriHost.endsWith(process.env.TOP_LEVEL_DOMAIN!)) {
            return redirectWithDefaultUri(origin, searchParams);
        }
    } catch (e) {
        return redirectWithDefaultUri(origin, searchParams);
    }
    return NextResponse.next();
};

const redirectWithDefaultUri = (
    origin: string,
    searchParams: URLSearchParams
) => {
    searchParams.set(
        'redirect_uri',
        encodeURIComponent(`${process.env.ORIGIN!}/logged-in`)
    );
    return NextResponse.redirect(`${origin}/login?${searchParams.toString()}`);
};
