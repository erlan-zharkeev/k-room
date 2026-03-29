import { useMedia } from 'src/entities/media'
import { INITIAL_USER_STORE } from 'src/entities/user'

import { DbUserDataType } from 'src/shared/config'
import { db, dexieKeyValueStore } from 'src/shared/lib'

export const userStore = dexieKeyValueStore<DbUserDataType>(db.user, 'user')

export const useUser = () => {
  const userData = userStore.use<DbUserDataType>(INITIAL_USER_STORE)
  const { getLiveMedia } = useMedia()

  return {
    ...userData,
    avatarPath: getLiveMedia(`avatar.${userData.id}`),
    initialize: () => {
      userStore.ensure(INITIAL_USER_STORE)
    },
    reset: () => userStore.reset(INITIAL_USER_STORE),
    update: (changes: Partial<DbUserDataType>) => userStore.updateShallow(changes),
    setByPath: (path: string, value: unknown) => userStore.setByPath(path, value)
  }
}
