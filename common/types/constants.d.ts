export * from '../endpoints/config';
export declare const VALIDATION_LIMITS: {
    passwordMinLength: number;
    usernameMinLength: number;
    usernameMaxLength: number;
};
export declare const VALIDATION_PATTERNS: {
    passwordStrong: string;
    noSpaces: string;
    onlyLatin: string;
};
export declare const INFO_NOTIFICATION_STATUS: readonly ["read", "unread", "hidden"];
