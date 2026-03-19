import { AppDispatch } from 'src/app/store'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useMedia } from 'src/entities/media'
import { resetSystemStore } from 'src/entities/system'
import { useUser } from 'src/entities/user'

const resetStoreReducers = [resetSystemStore]

export const useResetAllStores = (dispatch: AppDispatch) => {
  const userStore = useUser()
  const contactStore = useContact()
  const mediaStore = useMedia()
  const chatRoomStore = useChatRoom()

  const stores = [contactStore.reset, mediaStore.reset, chatRoomStore.reset, userStore.reset]

  const reset = () => {
    stores.forEach((method) => {
      method()
    })
    resetStoreReducers.forEach((resetStore) => dispatch(resetStore()))
  }

  return { reset }
}
