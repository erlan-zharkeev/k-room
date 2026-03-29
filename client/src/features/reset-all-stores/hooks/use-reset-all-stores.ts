import { AppDispatchType } from 'src/app/store'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useMedia } from 'src/entities/media'
import { useUser } from 'src/entities/user'

import { RESET_STORE_REDUCERS } from '..'

export const useResetAllStores = (dispatch: AppDispatchType) => {
  const userStore = useUser()
  const contactStore = useContact()
  const mediaStore = useMedia()
  const chatRoomStore = useChatRoom()

  const stores = [contactStore.reset, mediaStore.reset, chatRoomStore.reset, userStore.reset]

  const reset = () => {
    stores.forEach((method) => {
      method()
    })
    RESET_STORE_REDUCERS.forEach((resetStore) => dispatch(resetStore()))
  }

  return { reset }
}
