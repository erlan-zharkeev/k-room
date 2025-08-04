export type MediaType = "image" | "video" | "audio";
export interface IImageObject {
    src: string;
    name: string;
    fileBuffer?: ArrayBuffer;
}
export type MediaFileValueType = IImageObject;
