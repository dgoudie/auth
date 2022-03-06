import { AppError } from './app-error';

export class InvalidRedirectUriError extends AppError {
    constructor(providedRedirectUri?: string) {
        super(
            400,
            !!providedRedirectUri
                ? `'${providedRedirectUri}' is not a valid redirect_uri`
                : `You must provide a valid redirect_uri`
        );
    }
}
