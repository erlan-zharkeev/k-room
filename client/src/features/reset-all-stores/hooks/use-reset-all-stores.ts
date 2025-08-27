import { AppDispatch } from 'src/app/store'

import { resetCallStore } from 'src/entities/call'
import { resetRoomsStore } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useMedia } from 'src/entities/media'
import { useSettings } from 'src/entities/settings'
import { resetSystemStore } from 'src/entities/system'
import { useUser } from 'src/entities/user'

const resetStoreReducers = [resetRoomsStore, resetSystemStore, resetCallStore]

export const useResetAllStores = (dispatch: AppDispatch) => {
  const settingsStore = useSettings()
  const userStore = useUser()
  const contactStore = useContact()
  const mediaStore = useMedia()

  const stores = [settingsStore.reset, userStore.reset, contactStore.reset, mediaStore.reset]

  const reset = () => {
    stores.forEach((method) => {
      method()
    })
    resetStoreReducers.forEach((resetStore) => dispatch(resetStore()))
  }

  return { reset }
}
