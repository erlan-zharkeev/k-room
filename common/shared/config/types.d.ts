export type AuthTokensType = 'jwt' | 'refresh-jwt';
export type FirebaseProviderType = (typeof import('./constants').firebaseProviders)[number];
export type ProviderType = (typeof import('./constants').providers)[number];
export type AvailableCookieType = 'device-id' | AuthTokensType;
export type UnknownCallbackType = (...args: unknown[]) => unknown;
export interface IBasicStreamSettings {
    audio: boolean;
    video: boolean;
}
export interface IStreamSettings extends IBasicStreamSettings {
    streamLoading: boolean;
}
export interface IBackendMessage {
    text: string;
    silent: boolean;
}
export interface IBackendResponse<T> {
    payload: T;
    message: IBackendMessage;
}
type ValueOf<T> = T[keyof T];
export type RouteNameType = ValueOf<typeof import('../../endpoints/config').ROUTE_NAMES>;
export type EndpointsType = ValueOf<typeof import('../../endpoints/config').AUTH_ENDPOINTS> | ValueOf<typeof import('../../endpoints/config').USER_ENDPOINTS> | ValueOf<typeof import('../../endpoints/config').CODES_ENDPOINTS> | ValueOf<typeof import('../../endpoints/config').ADMIN_ENDPOINTS> | ValueOf<typeof import('../../endpoints/config').MEDIA_ENDPOINTS>;
export {};
