import { NextMiddleware, NextRequest, NextResponse } from 'next/server';

export const middleware: NextMiddleware = (req, ev) => {
    const { pathname, origin } = req.nextUrl;
    if (pathname == '/') {
        return NextResponse.redirect(`${origin}/login`);
    }
    return NextResponse.next();
};
