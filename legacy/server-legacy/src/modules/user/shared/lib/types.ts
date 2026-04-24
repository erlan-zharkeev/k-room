export type UserExistReasonType = 'username' | 'email' | 'id'

export type UserExistResultType = {
  exists: boolean
  reason: UserExistReasonType | null
}
