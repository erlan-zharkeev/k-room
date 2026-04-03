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
export declare const ROUTE_NAMES: {
    readonly login: "/login";
    readonly registration: "/registration";
    readonly emailConfirmation: "/email-confirmation";
    readonly waitEmailConfirm: "/wait-email-confirm";
    readonly main: "/app";
    readonly passwordRecovery: "/password-recovery";
    readonly createNewPassword: "/create-new-password";
    readonly notification: "/notification";
    readonly privacyPolicy: "/privacy-policy";
    readonly notFound: "/not-found";
};
export declare const AUTH_ENDPOINTS: {
    readonly registration: "/auth/registration";
    readonly sendEmailConfirmationLink: "/auth/send-email-confirmation-link";
    readonly confirmEmail: "/auth/confirm-email";
    readonly login: "/auth/login";
    readonly googleLogin: "/auth/google-login";
    readonly providerLogin: "/auth/provider-login";
    readonly logout: "/auth/logout";
    readonly updateTokensPair: "/auth/token/refresh";
};
export declare const USER_ENDPOINTS: {
    readonly getUserData: "/users/me";
    readonly editUserData: "/users/me";
    readonly resetPassword: "/user/reset-password";
    readonly markInfoNotificationAsRead: "/users/me/notifications/read";
};
export declare const MEDIA_ENDPOINTS: {
    readonly getMediaFile: "/media";
};
export declare const CODES_ENDPOINTS: {
    readonly sendEmailCodePasswordRecovery: "/codes/email/password-recovery";
    readonly validateEmailCodePasswordRecovery: "/codes/email/validate-email-code-password-recovery";
};
export declare const ADMIN_ENDPOINTS: {
    readonly getAppData: "/admin/get-app-data";
    readonly dbClear: "/admin/db-reset";
    readonly applyFixtures: "/admin/apply-fixtures";
    readonly deleteUser: "/admin/delete-user";
    readonly updateUserData: "/admin/update-user-data";
};
