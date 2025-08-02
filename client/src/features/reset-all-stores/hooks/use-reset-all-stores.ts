import { AppDispatch } from 'src/app/store'

import { resetCallStore } from 'src/entities/call'
import { resetRoomsStore } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useSettings } from 'src/entities/settings'
import { resetSystemStore } from 'src/entities/system'
import { resetUserStore } from 'src/entities/user'

const resetStoreReducers = [resetUserStore, resetRoomsStore, resetSystemStore, resetCallStore]

export const useResetAllStores = (dispatch: AppDispatch) => {
  const settingsStore = useSettings()
  const contactsStore = useContact()

  const stores = [settingsStore.reset, contactsStore.reset]

  const reset = () => {
    stores.forEach((method) => {
      method()
    })
    resetStoreReducers.forEach((resetStore) => dispatch(resetStore()))
  }

  return { reset }
}
