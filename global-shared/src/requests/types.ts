export interface CreateNewPasswordPayload {
  password: string
  codeToValidate: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  password: string
}

export interface UpdateUserDataPayload {
  nickname?: string
  'reset-avatar'?: 'reset' | ''
}
