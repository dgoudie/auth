import { addMonths } from 'date-fns';
import jwt from 'jsonwebtoken';

export const buildAuthToken = (email: string) =>
    jwt.sign(
        {
            iat: Date.now(),
            exp: addMonths(new Date(), 1).getTime(),
            sub: email,
            email,
            iss: process.env.ORIGIN,
            aud: process.env.ORIGIN,
            nbf: Date.now(),
        },
        process.env.JWT_TOKEN!
    );
