import { KRoomUser } from "./user";
export type AuthLoginPayload = Required<Pick<KRoomUser, "email" | "password">>;
export type AuthRegistrationPayload = Required<Pick<KRoomUser, "username" | "email" | "password">>;
