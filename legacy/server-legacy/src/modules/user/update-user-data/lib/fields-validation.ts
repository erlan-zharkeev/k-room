import { usernameRule } from 'src/modules/auth'

export const UPDATE_USER_DATA_FIELDS_VALIDATION = [usernameRule().optional()]
