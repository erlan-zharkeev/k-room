import { usernameRule } from 'src/features/auth'

export const UPDATE_USER_DATA_FIELDS_VALIDATION = [usernameRule().optional()]
