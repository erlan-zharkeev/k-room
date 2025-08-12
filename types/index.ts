export * from "./shared-types";

export enum RouteNamesEnum {
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
  // Don't forget to change path below in nginx manually
  SocketPath = "/app-socket/",
  Api = "/api/",
}

export enum StatusEnum {
  Success = 200,
  BadRequest = 400,
  NotAuth = 401,
  Forbidden = 403,
  NotFound = 404,
  Server = 500,
  Unreachable = 503,
  BadGateway = 504,
}

export enum AuthEndpointsEnum {
  Registration = "/auth/registration",
  SendEmailConfirmationLink = "/auth/send-email-confirmation-link",
  ConfirmEmail = "/auth/send-email-confirmation",
  Login = "/auth/login",
  GoogleLogin = "/auth/google-login",
  ProviderLogin = "/auth/provider-login",
  Logout = "/auth/logout",
  UpdateTokensPair = "/auth/update-tokens-pair",
}

export enum UserEndpointsEnum {
  GetUserData = "/user/get-user-data",
  UpdateUserData = "/user/user-data/update",
  ResetPassword = "/user/reset-password",
}

export enum CommonEndpointsEnum {
  CommonImages = "/common-images",
  InfoItem = "/info-item",
}

export enum CodesEndpointsEnum {
  SendEmailCodePasswordRecovery = "/codes/email/password-recovery",
  ValidateEmailCodePasswordRecovery = "/codes/email/validate-email-code-password-recovery",
}

export enum AdminEndpointsEnum {
  GetAppData = "/admin/get-app-data",
  DBClear = "/admin/db-reset",
  ApplyFixtures = "/admin/apply-fixtures",
  DeleteUser = "/admin/delete-user",
  UpdateUserData = "/admin/update-user-data",
}

export type EndpointsType =
  | AuthEndpointsEnum
  | UserEndpointsEnum
  | CommonEndpointsEnum
  | CodesEndpointsEnum
  | AdminEndpointsEnum;
