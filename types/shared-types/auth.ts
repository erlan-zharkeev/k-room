import { ProviderType } from "./common";

export interface AuthLoginPayloadType {
  email: string;
  password: string;
}

export interface AuthRegistrationPayloadType {
  username: string;
  email: string;
  password: string;
}

export interface SignInWithProviderPayloadType {
  username: string;
  email: string;
  provider: ProviderType;
  avatar?: string;
}
