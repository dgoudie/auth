import type { NextApiRequest, NextApiResponse } from 'next';

import { AUTH_COOKIE_NAME } from '../../constants';
import { buildAuthToken } from '../../utils/jsonwebtoken';
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { setCookies } from 'cookies-next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).end();
        return;
    }
    console.log('req', req);
    if (req.body.password === 'a') {
        const token = buildAuthToken(req.body.email);
        setCookies(AUTH_COOKIE_NAME, token, {
            req,
            res,
            httpOnly: true,
            domain: process.env.ORIGIN,
        });
        res.redirect(req.body.redirectUri).end();
    } else {
        let usp = new URLSearchParams();
        usp.append('redirect_uri', req.body.redirectUri);
        usp.append('error', 'invalid_credentials');
        res.redirect(`/login?${usp.toString()}`).end();
    }
}
