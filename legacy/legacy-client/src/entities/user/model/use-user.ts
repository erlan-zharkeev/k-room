import { INITIAL_USER_STORE } from 'src/entities/user/constants'

import { DbUserData } from 'src/shared/config'
import { db, dexieKeyValueStore } from 'src/shared/lib'

const userStore = dexieKeyValueStore<DbUserData>(db.user, 'user')

export const useUser = () => {
  const { shallowUpdate } = userStore
  const userData = userStore.use(INITIAL_USER_STORE)

  return {
    ...userData,
    initialize: () => userStore.ensure(INITIAL_USER_STORE),
    reset: () => userStore.reset(INITIAL_USER_STORE),
    shallowUpdate
  }
}
