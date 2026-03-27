import { StatusEnum } from './status';
export const SENTRY_IGNORED_SUBSTRINGS = [
    'non authorized',
    'unauthorized',
    'forbidden',
    'not found',
    'failed to fetch',
    'network error',
    'load failed',
    'the user aborted a request'
];
export const isIgnoredSentryStatus = (status) => {
    switch (status) {
        case StatusEnum.BadRequest:
        case StatusEnum.NotAuth:
        case StatusEnum.Forbidden:
        case StatusEnum.NotFound:
            return true;
        default:
            return false;
    }
};
export const shouldIgnoreSentryError = ({ message, silent, status }) => {
    if (silent)
        return true;
    if (isIgnoredSentryStatus(status))
        return true;
    if (!message)
        return false;
    const normalizedMessage = message.toLowerCase();
    return SENTRY_IGNORED_SUBSTRINGS.some((substring) => normalizedMessage.includes(substring));
};
