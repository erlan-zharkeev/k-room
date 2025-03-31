import { IUserData } from "./user";

export type AuthLoginPayloadType = Required<
  Pick<IUserData, "email" | "password">
>;
export type AuthRegistrationPayloadType = Required<
  Pick<IUserData, "username" | "email" | "password">
>;
