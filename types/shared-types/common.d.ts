export type AuthTokensType = "jwt" | "refresh-jwt";
export type AvailableCookieType = "device-id" | AuthTokensType;
export type UnknownCallback = (...args: any[]) => any;
export interface IBasicStreamSettings {
    audio: boolean;
    video: boolean;
}
export interface IStreamSettings extends IBasicStreamSettings {
    streamLoading: boolean;
}
