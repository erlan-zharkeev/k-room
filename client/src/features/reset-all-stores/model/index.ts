import { AppDispatch } from 'src/app/store'

import { resetCallStore } from 'src/entities/call'
import { resetRoomsStore } from 'src/entities/chat-room'
import { resetContactStore } from 'src/entities/contact'
import { resetSettings } from 'src/entities/settings'
import { resetSystemStore } from 'src/entities/system'
import { resetUserStore } from 'src/entities/user'

const resetStoreReducers = [
  resetUserStore,
  resetRoomsStore,
  resetContactStore,
  resetSystemStore,
  resetSettings,
  resetCallStore
]

export const resetAllStores = (dispatch: AppDispatch) => {
  resetStoreReducers.forEach((resetStore) => dispatch(resetStore()))
}
