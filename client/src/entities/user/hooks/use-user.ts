import { DbUserDataType } from 'src/shared/config'
import { db, dexieKeyValueStore } from 'src/shared/lib'

import { INITIAL_USER_STORE } from '../config'

export const userStore = dexieKeyValueStore<DbUserDataType>(db.user, 'user')

export const useUser = () => {
  const userData = userStore.use<DbUserDataType>(INITIAL_USER_STORE)

  return {
    ...userData,
    initialize: () => userStore.ensure(INITIAL_USER_STORE),
    reset: () => userStore.reset(INITIAL_USER_STORE),
    update: (changes: Partial<DbUserDataType>) => userStore.updateShallow(changes),
    setByPath: (path: string, value: unknown) => userStore.setByPath(path, value)
  }
}
