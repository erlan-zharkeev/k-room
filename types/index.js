export * from "./shared-types";
export var RouteNames;
(function (RouteNames) {
    RouteNames["Login"] = "/login";
    RouteNames["Registration"] = "/registration";
    RouteNames["EmailConfirmation"] = "/email-confirmation";
    RouteNames["WaitEmailCofirm"] = "/wait-email-confirm";
    RouteNames["Main"] = "/app";
    RouteNames["PasswordRecovery"] = "/password-recovery";
    RouteNames["CreateNewPassword"] = "/create-new-password";
    RouteNames["Notification"] = "/notification";
    RouteNames["PrivacyPolicy"] = "/privacy-policy";
    RouteNames["NotFound"] = "/not-found";
    // Don't forget to change path below in nginx manually
    RouteNames["SocketPath"] = "/app-socket/";
    RouteNames["Api"] = "/api/";
})(RouteNames || (RouteNames = {}));
export var Status;
(function (Status) {
    Status[Status["Success"] = 200] = "Success";
    Status[Status["BadRequest"] = 400] = "BadRequest";
    Status[Status["NotAuth"] = 401] = "NotAuth";
    Status[Status["Forbidden"] = 403] = "Forbidden";
    Status[Status["NotFound"] = 404] = "NotFound";
    Status[Status["Server"] = 500] = "Server";
    Status[Status["Unreachable"] = 503] = "Unreachable";
    Status[Status["BadGateway"] = 504] = "BadGateway";
})(Status || (Status = {}));
export var AuthEndpoints;
(function (AuthEndpoints) {
    AuthEndpoints["Registration"] = "/auth/registration";
    AuthEndpoints["SendEmailConfirmationLink"] = "/auth/send-email-confirmation-link";
    AuthEndpoints["SendEmailConfirmation"] = "/auth/send-email-confirmation";
    AuthEndpoints["Login"] = "/auth/login";
    AuthEndpoints["GoogleLogin"] = "/auth/google-login";
    AuthEndpoints["ProviderLogin"] = "/auth/provider-login";
    AuthEndpoints["Logout"] = "/auth/logout";
    AuthEndpoints["UpdateTokensPair"] = "/auth/update-tokens-pair";
})(AuthEndpoints || (AuthEndpoints = {}));
export var UserEndpoints;
(function (UserEndpoints) {
    UserEndpoints["GetUserData"] = "/auth/get-user-data";
    UserEndpoints["UpdateUserData"] = "/auth/user-data/update";
    UserEndpoints["ResetPassword"] = "/user/reset-password";
})(UserEndpoints || (UserEndpoints = {}));
export var CommonEndpoints;
(function (CommonEndpoints) {
    CommonEndpoints["CommonImages"] = "/common-images";
    CommonEndpoints["GetInfo"] = "/notification";
})(CommonEndpoints || (CommonEndpoints = {}));
export var CodesEndpoints;
(function (CodesEndpoints) {
    CodesEndpoints["SendEmailCodePasswordRecovery"] = "/codes/email/password-recovery";
    CodesEndpoints["ValidateEmailCodePasswordRecovery"] = "/codes/email/validate-email-code-password-recovery";
})(CodesEndpoints || (CodesEndpoints = {}));
export var AdminEndpoints;
(function (AdminEndpoints) {
    AdminEndpoints["GetAppData"] = "/admin/get-app-data";
    AdminEndpoints["DBClear"] = "/admin/db-reset";
    AdminEndpoints["ApplyFixtures"] = "/admin/apply-fixtures";
    AdminEndpoints["DeleteUser"] = "/admin/delete-user";
    AdminEndpoints["UpdateUserData"] = "/admin/update-user-data";
})(AdminEndpoints || (AdminEndpoints = {}));
