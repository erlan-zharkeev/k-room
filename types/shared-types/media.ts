export type MediaType = "image" | "video" | "audio" | "pdf" | "unknown";

export interface IImageObject {
  src: string;
  name: string;
  fileBuffer?: ArrayBuffer;
}

export type MediaFileValueType = IImageObject;
