export type AuthTokensType = "jwt" | "refresh-jwt";

export interface IImageObject {
  src: string;
  name: string;
  fileBuffer?: ArrayBuffer;
}
