export * from "./shared-types";
export declare enum RouteNames {
    SIGN_IN = "/sign-in",
    SIGN_UP = "/sign-up",
    WAIT_EMAIL_CONFIRM = "/wait-email-confirm",
    EMAIL_CONFIRM = "/confirm-email",
    MAIN = "/app",
    NOT_FOUND = "/not-found",
    PASSWORD_RECOVERY = "/password-recovery",
    CREATE_NEW_PASSWORD = "/create-new-password",
    NOTIFICATION = "/notification",
    PRIVACY_POLICY = "/privacy-policy/",
    ADMIN_PANEL = "/admin-panel/",
    SOCKET_PATH = "/app-socket/",
    API = "/api/"
}
export declare enum Status {
    Success = 200,
    BadRequest = 400,
    NotAuth = 401,
    Forbidden = 403,
    NotFound = 404,
    Server = 500,
    Unreachable = 503,
    BadGateway = 504
}
export declare enum AuthEndpoints {
    Registration = "/auth/registration",
    SendEmailConfirmationLink = "/auth/send-email-confirmation-link",
    SendEmailConfirmation = "/auth/send-email-confirmation",
    Login = "/auth/login",
    GoogleLogin = "/auth/google-login",
    ProviderLogin = "/auth/provider-login",
    Logout = "/auth/logout",
    UpdateTokensPair = "/auth/update-tokens-pair"
}
export declare enum UserEndpoints {
    GetUserData = "/auth/get-user-data",
    UpdateUserData = "/auth/user-data/update",
    ResetPassword = "/user/reset-password"
}
export declare enum CommonEndpoints {
    CommonImages = "/common-images",
    GetInfo = "/notification"
}
export declare enum CodesEndpoints {
    SendEmailCodePasswordRecovery = "/codes/email/password-recovery",
    ValidateEmailCodePasswordRecovery = "/codes/email/validate-email-code-password-recovery"
}
export declare enum AdminEndpoints {
    GetAppData = "/admin/get-app-data",
    DBClear = "/admin/db-reset",
    ApplyFixtures = "/admin/apply-fixtures",
    DeleteUser = "/admin/delete-user",
    UpdateUserData = "/admin/update-user-data"
}
export type EndpointsType = AuthEndpoints | UserEndpoints | CommonEndpoints | CodesEndpoints | AdminEndpoints;
