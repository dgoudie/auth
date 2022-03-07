import { NextMiddleware, NextRequest, NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME } from '../../constants';
import { isValidAuthToken } from '../../utils/cloudflare-worker-jwt';

export const middleware: NextMiddleware = (req, ev) => {
    const token = req.cookies[AUTH_COOKIE_NAME];
    const isValid = isValidAuthToken(token);
    if (!isValid) {
        return NextResponse.redirect(`${req.nextUrl.origin}/login`);
    }
    return NextResponse.next();
};
