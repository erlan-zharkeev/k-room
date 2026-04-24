import { computed } from 'vue'

import type { DbUserDataType } from 'src/shared/config'
import { db, dexieKeyValueStore } from 'src/shared/lib'

import { INITIAL_USER_STORE } from '../config/constants'

const userStore = dexieKeyValueStore<DbUserDataType>(db.user, 'user')

export const useUser = () => {
  const { ensure, reset, shallowUpdate } = userStore
  const user = userStore.use(INITIAL_USER_STORE)
  const isAuthorized = computed(() => Boolean(user.value.id))

  return {
    user,
    isAuthorized,
    initialize: () => ensure(INITIAL_USER_STORE),
    reset: () => reset(INITIAL_USER_STORE),
    shallowUpdate
  }
}
