export * from "./shared-types";
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
export var StatusEnum;
(function (StatusEnum) {
    StatusEnum[StatusEnum["Success"] = 200] = "Success";
    StatusEnum[StatusEnum["BadRequest"] = 400] = "BadRequest";
    StatusEnum[StatusEnum["NotAuth"] = 401] = "NotAuth";
    StatusEnum[StatusEnum["Forbidden"] = 403] = "Forbidden";
    StatusEnum[StatusEnum["NotFound"] = 404] = "NotFound";
    StatusEnum[StatusEnum["Server"] = 500] = "Server";
    StatusEnum[StatusEnum["Unreachable"] = 503] = "Unreachable";
    StatusEnum[StatusEnum["BadGateway"] = 504] = "BadGateway";
})(StatusEnum || (StatusEnum = {}));
export var AuthEndpointsEnum;
(function (AuthEndpointsEnum) {
    AuthEndpointsEnum["Registration"] = "/auth/registration";
    AuthEndpointsEnum["SendEmailConfirmationLink"] = "/auth/send-email-confirmation-link";
    AuthEndpointsEnum["SendEmailConfirmation"] = "/auth/send-email-confirmation";
    AuthEndpointsEnum["Login"] = "/auth/login";
    AuthEndpointsEnum["GoogleLogin"] = "/auth/google-login";
    AuthEndpointsEnum["ProviderLogin"] = "/auth/provider-login";
    AuthEndpointsEnum["Logout"] = "/auth/logout";
    AuthEndpointsEnum["UpdateTokensPair"] = "/auth/update-tokens-pair";
})(AuthEndpointsEnum || (AuthEndpointsEnum = {}));
export var UserEndpointsEnum;
(function (UserEndpointsEnum) {
    UserEndpointsEnum["GetUserData"] = "/auth/get-user-data";
    UserEndpointsEnum["UpdateUserData"] = "/auth/user-data/update";
    UserEndpointsEnum["ResetPassword"] = "/user/reset-password";
})(UserEndpointsEnum || (UserEndpointsEnum = {}));
export var CommonEndpointsEnum;
(function (CommonEndpointsEnum) {
    CommonEndpointsEnum["CommonImages"] = "/common-images";
    CommonEndpointsEnum["InfoItem"] = "/info-item";
})(CommonEndpointsEnum || (CommonEndpointsEnum = {}));
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
