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
export declare enum AuthEndpointsEnum {
    Registration = "/auth/registration",
    SendEmailConfirmationLink = "/auth/send-email-confirmation-link",
    ConfirmEmail = "/auth/send-email-confirmation",
    Login = "/auth/login",
    GoogleLogin = "/auth/google-login",
    ProviderLogin = "/auth/provider-login",
    Logout = "/auth/logout",
    UpdateTokensPair = "/auth/update-tokens-pair"
}
export declare enum UserEndpointsEnum {
    GetUserData = "/user/get-user-data",
    EditUserData = "/user/user-data/edit",
    ResetPassword = "/user/reset-password",
    MarkInfoNotificationAsRead = "/user/notification/read"
}
export declare enum MediaEndpointsEnum {
    GetMediaFile = "/media/get-media-file"
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
export type EndpointsType = AuthEndpointsEnum | UserEndpointsEnum | CodesEndpointsEnum | AdminEndpointsEnum | MediaEndpointsEnum;
