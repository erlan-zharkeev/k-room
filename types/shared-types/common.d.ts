import { StatusEnum } from "..";
export type AuthTokensType = "jwt" | "refresh-jwt";
export declare const firebaseProviders: readonly ["google", "facebook"];
export type FirebaseProviderType = typeof firebaseProviders;
export declare const providers: readonly ["google", "facebook", "app"];
export type ProviderType = (typeof providers)[number];
export type AvailableCookieType = "device-id" | AuthTokensType;
export type UnknownCallback = (...args: any[]) => any;
export interface IBasicStreamSettings {
    audio: boolean;
    video: boolean;
}
export interface IStreamSettings extends IBasicStreamSettings {
    streamLoading: boolean;
}
export interface IBackendResponse<T> {
    status: StatusEnum;
    data: T;
    message: {
        text: string;
        silent: boolean;
    };
}
