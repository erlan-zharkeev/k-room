import { AppDispatchType } from 'src/app/store'

import { RESET_STORE_REDUCERS } from 'src/features/reset-all-stores'

import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useInfoNotification } from 'src/entities/info-notification'
import { useMedia } from 'src/entities/media'
import { useUser } from 'src/entities/user'

export const useResetAllStores = (dispatch: AppDispatchType) => {
  const userStore = useUser()
  const contactStore = useContact()
  const infoNotificationStore = useInfoNotification()
  const mediaStore = useMedia()
  const chatRoomStore = useChatRoom()

  const stores = [contactStore.reset, infoNotificationStore.reset, mediaStore.reset, chatRoomStore.reset, userStore.reset]

  const reset = () => {
    stores.forEach((method) => {
      method()
    })
    RESET_STORE_REDUCERS.forEach((resetStore) => dispatch(resetStore()))
  }

  return { reset }
}
