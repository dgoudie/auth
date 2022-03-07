import { NextMiddleware, NextRequest, NextResponse } from 'next/server';

export const middleware: NextMiddleware = (req, ev) => {
    const {
        nextUrl: { searchParams, origin },
    } = req;
    let redirectUri = searchParams.get('redirect_uri');
    if (!redirectUri) {
        return redirectWithDefaultUri(origin);
    }
    redirectUri = decodeURIComponent(redirectUri).toLowerCase();
    try {
        const redirectUriHost = new URL(redirectUri).host;
        if (!redirectUriHost.endsWith(process.env.ORIGIN!)) {
            return redirectWithDefaultUri(origin);
        }
    } catch (e) {
        return redirectWithDefaultUri(origin);
    }
    return NextResponse.next();
};

const redirectWithDefaultUri = (origin: string) => {
    return NextResponse.redirect(
        `${origin}/login?redirect_uri=${encodeURIComponent(
            process.env.DEFAULT_REDIRECT_URL!
        )}`
    );
};
