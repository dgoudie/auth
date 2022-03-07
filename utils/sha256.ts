import { createHash } from 'crypto';

export const performSHA256Hash = (input: string): string => {
    if (!input) {
        return input;
    }

    const hash = createHash('sha256');

    hash.write(input);
    hash.end();
    return hash.digest('hex');
};
