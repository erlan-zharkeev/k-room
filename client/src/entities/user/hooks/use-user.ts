import { useMedia } from 'src/entities/media'
import { INITIAL_USER_STORE } from 'src/entities/user'

import { DbUserDataType } from 'src/shared/config'
import { db, dexieKeyValueStore } from 'src/shared/lib'

const userStore = dexieKeyValueStore<DbUserDataType>(db.user, 'user')

export const useUser = () => {
  const { shallowUpdate } = userStore
  const userData = userStore.use(INITIAL_USER_STORE)
  const { getLiveMediaUrl } = useMedia()
  const avatarPath = getLiveMediaUrl(`avatar.${userData.id}`)

  return {
    ...userData,
    avatarPath,
    initialize: () => userStore.ensure(INITIAL_USER_STORE),
    reset: () => userStore.reset(INITIAL_USER_STORE),
    shallowUpdate
  }
}
