import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'
import { AppDispatch } from 'src/shared/store'
import { resetSystemStore } from 'src/shared/system'

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

    dispatch(resetSystemStore())
  }

  return { reset }
}
