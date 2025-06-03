export type AuthTokensType = "jwt" | "refresh-jwt";

export interface IImageObject {
  src: string;
  name: string;
  fileBuffer?: ArrayBuffer;
}

export type MediaFileValueType = IImageObject;

export type FileLoaderValueType = MediaFileValueType | MediaFileValueType[];

export type UnknownCallback = (...args: any[]) => any;
