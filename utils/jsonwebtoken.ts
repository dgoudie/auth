import { UserModel } from '../mongoose/User';
import jwt from 'jsonwebtoken';

export interface JWTPayload {
    iat: number;
    exp: number;
    sub: string;
    email: string;
    iss: string;
    aud: string;
    nbf: number;
}

export const buildAuthToken = (user: UserModel, expirationDate: Date) => {
    const payload: JWTPayload = {
        iat: Date.now(),
        exp: expirationDate.getTime(),
        sub: user._id,
        email: user.emailAddress,
        iss: process.env.ORIGIN!,
        aud: process.env.ORIGIN!,
        nbf: Date.now(),
    };
    return jwt.sign(payload, process.env.JWT_TOKEN!);
};
