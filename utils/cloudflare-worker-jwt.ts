import jwt from '@tsndr/cloudflare-worker-jwt';

export const isValidAuthToken = (token: string | undefined) => {
    if (!token) {
        return false;
    }
    return jwt.verify(token, process.env.JWT_TOKEN!);
};
