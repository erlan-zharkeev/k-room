import { IFrontendUserData } from "./user";

export interface IConfirmEmailResponse {
  email: string;
}

export interface ILoginResponse extends IFrontendUserData {}

export interface ISignInWithProvider extends IFrontendUserData {}

export interface IGetUserDataResponse extends IFrontendUserData {}
