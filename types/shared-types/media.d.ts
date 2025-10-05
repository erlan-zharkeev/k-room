/// <reference types="node" />
/// <reference types="node" />
import type { Buffer } from 'node:buffer';
export type MediaKindType = "image" | "video" | "audio" | "pdf" | "unknown";
export interface IImageObject {
    src: string;
    name: string;
    fileBuffer?: Buffer;
}
export type MediaFileValueType = IImageObject;
