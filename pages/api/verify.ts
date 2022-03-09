import { NextApiRequest, NextApiResponse } from 'next';
import {
    buildAuthToken,
    decodeAuthToken,
    isValidAuthToken,
} from '../../utils/jsonwebtoken';

import { AUTH_COOKIE_NAME } from '../../constants';
import { addMonths } from 'date-fns';
import { setCookies } from 'cookies-next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const token = req.cookies[AUTH_COOKIE_NAME];
    if (isValidAuthToken(token)) {
        res.status(200).end();
    } else {
        let redirectUri: string | undefined = undefined;
        const forwardedProto = req.headers['x-forwarded-proto'];
        const forwardedHost = req.headers['x-forwarded-host'];
        const forwardedUri = req.headers['x-forwarded-uri'];
        try {
            let url = new URL(
                `${forwardedProto}://${forwardedHost}${forwardedUri}`
            );
            redirectUri = encodeURIComponent(url.toString());
        } catch (e) {}
        let params = new URLSearchParams();
        !!redirectUri && params.set('redirect_uri', redirectUri);
        res.writeHead(302, {
            location: `${process.env.ORIGIN!}/login?${params.toString()}`,
        }).end();
    }
}
