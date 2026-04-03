import { IFrontendUserData } from 'common/user';
export interface IConfirmEmailResponse {
    email: string;
}
export interface ILoginResponse extends IFrontendUserData {
}
export interface ISignInWithProviderResponse extends IFrontendUserData {
}
export interface IGetUserDataResponse extends IFrontendUserData {
}
export interface ISendConfirmationLinkResponse {
    email: string;
    nextRequestTime: number;
    attempts: number;
}
export interface ISendPasswordRecoveryCodeResponse {
    nextTimeRequest: number;
    debugCode?: string;
}
export interface IValidatePasswordRecoveryCodeResponse {
    query: string;
}
