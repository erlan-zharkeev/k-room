export * from "./shared-types";
export declare enum RouteNamesEnum {
    Login = "/login",
    Registration = "/registration",
    EmailConfirmation = "/email-confirmation",
    WaitEmailConfirm = "/wait-email-confirm",
    Main = "/app",
    PasswordRecovery = "/password-recovery",
    CreateNewPassword = "/create-new-password",
    Notification = "/notification",
    PrivacyPolicy = "/privacy-policy",
    NotFound = "/not-found",
    SocketPath = "/app-socket/",
    Api = "/api/"
}
export declare enum StatusEnum {
    Success = 200,
    BadRequest = 400,
    NotAuth = 401,
    Forbidden = 403,
    NotFound = 404,
    Server = 500,
    Unreachable = 503,
    BadGateway = 504
}
export declare enum AuthEndpointsEnum {
    Registration = "/auth/registration",
    SendEmailConfirmationLink = "/auth/send-email-confirmation-link",
    SendEmailConfirmation = "/auth/send-email-confirmation",
    Login = "/auth/login",
    GoogleLogin = "/auth/google-login",
    ProviderLogin = "/auth/provider-login",
    Logout = "/auth/logout",
    UpdateTokensPair = "/auth/update-tokens-pair"
}
export declare enum UserEndpointsEnum {
    GetUserData = "/auth/get-user-data",
    UpdateUserData = "/auth/user-data/update",
    ResetPassword = "/user/reset-password"
}
export declare enum CommonEndpointsEnum {
    CommonImages = "/common-images",
    GetInfo = "/notification"
}
export declare enum CodesEndpointsEnum {
    SendEmailCodePasswordRecovery = "/codes/email/password-recovery",
    ValidateEmailCodePasswordRecovery = "/codes/email/validate-email-code-password-recovery"
}
export declare enum AdminEndpointsEnum {
    GetAppData = "/admin/get-app-data",
    DBClear = "/admin/db-reset",
    ApplyFixtures = "/admin/apply-fixtures",
    DeleteUser = "/admin/delete-user",
    UpdateUserData = "/admin/update-user-data"
}
export type EndpointsType = AuthEndpointsEnum | UserEndpointsEnum | CommonEndpointsEnum | CodesEndpointsEnum | AdminEndpointsEnum;
