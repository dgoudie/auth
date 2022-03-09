import { UserModel } from '../mongoose/User';
import jwt from 'jsonwebtoken';
import jwtDates from './jwt-dates';
import { subMinutes } from 'date-fns';

export interface JWTPayload {
    iat: number;
    exp: number;
    sub: string;
    email: string;
    iss: string;
    aud: string;
    nbf: number;
}

export const buildAuthToken = (
    sub: string,
    email: string,
    expirationDate: Date
) => {
    const payload: JWTPayload = {
        iat: jwtDates.now(),
        exp: jwtDates.dateToJWTTimestamp(expirationDate),
        sub,
        email,
        iss: process.env.TOP_LEVEL_DOMAIN!,
        aud: process.env.TOP_LEVEL_DOMAIN!,
        nbf: jwtDates.now(),
    };
    return jwt.sign(payload, process.env.JWT_TOKEN!);
};

export const isValidAuthToken = (token: string | undefined) => {
    if (!token) {
        return false;
    }
    try {
        jwt.verify(token, process.env.JWT_TOKEN!);
        return true;
    } catch (e) {}
    return false;
};

export const decodeAuthToken = (token: string): JWTPayload => {
    return jwt.decode(token) as JWTPayload;
};
