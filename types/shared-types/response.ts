import { IFrontendUserData } from "./user";

export interface IConfirmEmailResponse {
  email: string;
}

export interface ILoginResponse extends IFrontendUserData { }

export interface ISignInWithProviderResponse extends IFrontendUserData { }

export interface IGetUserDataResponse extends IFrontendUserData { }

export interface ISendConfirmationLinkResponse {
  email: string
  nextRequestTime: string
  attempts: number
}