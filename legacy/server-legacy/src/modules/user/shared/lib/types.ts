export type UserExistReason = 'username' | 'email' | 'id'

export type UserExistResult = {
  exists: boolean
  reason: UserExistReason | null
}
