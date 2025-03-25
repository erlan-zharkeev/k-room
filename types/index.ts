export * from "./shared-types";

export enum RouteNames {
  Login = "/login",
  Registration = "/registration",
  EmailConfirmation = "/email-confirmation",
  WaitEmailCofirm = "/wait-email-confirm",
  Main = "/app",
  PasswordRecovery = "/password-recovery",
  CreateNewPassword = "/create-new-password",
  Notification = "/notification",
  PrivacyPolicy = "/privacy-policy",
  NotFound = "/not-found",
  // Don't forget to change path below in nginx manually
  SocketPath = "/app-socket/",
  Api = "/api/",
}

export enum Status {
  Success = 200,
  BadRequest = 400,
  NotAuth = 401,
  Forbidden = 403,
  NotFound = 404,
  Server = 500,
  Unreachable = 503,
  BadGateway = 504,
}

export enum AuthEndpoints {
  Registration = "/auth/registration",
  SendEmailConfirmationLink = "/auth/send-email-confirmation-link",
  SendEmailConfirmation = "/auth/send-email-confirmation",
  Login = "/auth/login",
  GoogleLogin = "/auth/google-login",
  ProviderLogin = "/auth/provider-login",
  Logout = "/auth/logout",
  UpdateTokensPair = "/auth/update-tokens-pair",
}

export enum UserEndpoints {
  GetUserData = "/auth/get-user-data",
  UpdateUserData = "/auth/user-data/update",
  ResetPassword = "/user/reset-password",
}

export enum CommonEndpoints {
  CommonImages = "/common-images",
  GetInfo = "/notification",
}

export enum CodesEndpoints {
  SendEmailCodePasswordRecovery = "/codes/email/password-recovery",
  ValidateEmailCodePasswordRecovery = "/codes/email/validate-email-code-password-recovery",
}

export enum AdminEndpoints {
  GetAppData = "/admin/get-app-data",
  DBClear = "/admin/db-reset",
  ApplyFixtures = "/admin/apply-fixtures",
  DeleteUser = "/admin/delete-user",
  UpdateUserData = "/admin/update-user-data",
}

export type EndpointsType =
  | AuthEndpoints
  | UserEndpoints
  | CommonEndpoints
  | CodesEndpoints
  | AdminEndpoints;
