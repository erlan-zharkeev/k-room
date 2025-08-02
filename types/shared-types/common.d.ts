export type AuthTokensType = "jwt" | "refresh-jwt";
export type MediaType = "image" | "video" | "audio";
export interface IImageObject {
    src: string;
    name: string;
    fileBuffer?: ArrayBuffer;
}
export type MediaFileValueType = IImageObject;
export type FileLoaderValueType = MediaFileValueType | MediaFileValueType[];
export type UnknownCallback = (...args: any[]) => any;
export interface IBasicStreamSettings {
    audio: boolean;
    video: boolean;
}
export interface IStreamSettings extends IBasicStreamSettings {
    streamLoading: boolean;
}
