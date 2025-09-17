export var RouteNamesEnum;
(function (RouteNamesEnum) {
    RouteNamesEnum["Login"] = "/login";
    RouteNamesEnum["Registration"] = "/registration";
    RouteNamesEnum["EmailConfirmation"] = "/email-confirmation";
    RouteNamesEnum["WaitEmailConfirm"] = "/wait-email-confirm";
    RouteNamesEnum["Main"] = "/app";
    RouteNamesEnum["PasswordRecovery"] = "/password-recovery";
    RouteNamesEnum["CreateNewPassword"] = "/create-new-password";
    RouteNamesEnum["Notification"] = "/notification";
    RouteNamesEnum["PrivacyPolicy"] = "/privacy-policy";
    RouteNamesEnum["NotFound"] = "/not-found";
    // Don't forget to change path below in nginx manually
    RouteNamesEnum["SocketPath"] = "/app-socket/";
    RouteNamesEnum["Api"] = "/api/";
})(RouteNamesEnum || (RouteNamesEnum = {}));
export var AuthEndpointsEnum;
(function (AuthEndpointsEnum) {
    AuthEndpointsEnum["Registration"] = "/auth/registration";
    AuthEndpointsEnum["SendEmailConfirmationLink"] = "/auth/send-email-confirmation-link";
    AuthEndpointsEnum["ConfirmEmail"] = "/auth/send-email-confirmation";
    AuthEndpointsEnum["Login"] = "/auth/login";
    AuthEndpointsEnum["GoogleLogin"] = "/auth/google-login";
    AuthEndpointsEnum["ProviderLogin"] = "/auth/provider-login";
    AuthEndpointsEnum["Logout"] = "/auth/logout";
    AuthEndpointsEnum["UpdateTokensPair"] = "/auth/update-tokens-pair";
})(AuthEndpointsEnum || (AuthEndpointsEnum = {}));
export var UserEndpointsEnum;
(function (UserEndpointsEnum) {
    UserEndpointsEnum["GetUserData"] = "/user/get-user-data";
    UserEndpointsEnum["EditUserData"] = "/user/user-data/edit";
    UserEndpointsEnum["ResetPassword"] = "/user/reset-password";
    UserEndpointsEnum["MarkInfoNotificationAsRead"] = "/user/notification/read";
})(UserEndpointsEnum || (UserEndpointsEnum = {}));
export var MediaEndpointsEnum;
(function (MediaEndpointsEnum) {
    MediaEndpointsEnum["GetMediaFile"] = "/media/get-media-file";
})(MediaEndpointsEnum || (MediaEndpointsEnum = {}));
export var CodesEndpointsEnum;
(function (CodesEndpointsEnum) {
    CodesEndpointsEnum["SendEmailCodePasswordRecovery"] = "/codes/email/password-recovery";
    CodesEndpointsEnum["ValidateEmailCodePasswordRecovery"] = "/codes/email/validate-email-code-password-recovery";
})(CodesEndpointsEnum || (CodesEndpointsEnum = {}));
export var AdminEndpointsEnum;
(function (AdminEndpointsEnum) {
    AdminEndpointsEnum["GetAppData"] = "/admin/get-app-data";
    AdminEndpointsEnum["DBClear"] = "/admin/db-reset";
    AdminEndpointsEnum["ApplyFixtures"] = "/admin/apply-fixtures";
    AdminEndpointsEnum["DeleteUser"] = "/admin/delete-user";
    AdminEndpointsEnum["UpdateUserData"] = "/admin/update-user-data";
})(AdminEndpointsEnum || (AdminEndpointsEnum = {}));
