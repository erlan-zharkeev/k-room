export interface ICreateNewPasswordPayload {
  password: string
  codeToValidate: string
}

export interface IChangePasswordPayload {
  currentPassword: string
  password: string
}
