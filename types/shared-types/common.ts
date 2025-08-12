import { StatusEnum } from "..";

export type AuthTokensType = "jwt" | "refresh-jwt";

export const firebaseProviders = ["google", "facebook"] as const;
export type FirebaseProviderType = typeof firebaseProviders;

export const providers = [...firebaseProviders, "app"] as const;
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
  data: T;
  message: {
    text: string;
    silent: boolean;
  };
}
