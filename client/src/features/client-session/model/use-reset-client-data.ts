import { useChatRoom } from 'src/entities/chat-room'
import { useContact } from 'src/entities/contact'
import { useInfoNotification } from 'src/entities/info-notification'
import { useMedia } from 'src/entities/media-file'
import { useUser } from 'src/entities/user'

export const useResetClientData = () => {
  const chatRoomStore = useChatRoom()
  const contactStore = useContact()
  const infoNotificationStore = useInfoNotification()
  const mediaStore = useMedia()
  const userStore = useUser()

  const resetClientData = async () => {
    await Promise.all([
      chatRoomStore.reset(),
      contactStore.reset(),
      infoNotificationStore.reset(),
      mediaStore.reset(),
      userStore.reset()
    ])
  }

  return {
    resetClientData
  }
}
