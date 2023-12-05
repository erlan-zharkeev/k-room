import { NotificationType } from 'common-types'
import { MessageNotification } from 'src/components'
import { $sound, Sounds } from 'src/services'
import { showNotification } from '..'

export const SystemMiddleware = (store: any) => (next: any) => (action: any) => {
  if (!action) return
  const dispatch = store.dispatch
  switch (action.type) {
    case 'rooms/updateChatMessage':
      const { soundOn } = store.getState().persist.settings
      const { message } = action.payload
      if (!message.isSelf) {
        dispatch(
          showNotification({
            message: MessageNotification(message),
            messageType: NotificationType.info,
            placement: 'topRight'
          })
        )
        if (soundOn) $sound(Sounds.messageDelivered).play()
      }
      break
    case 'system/showNotification':
      const { ableToShowNotification } = store.getState().persist.settings
      action.payload.ableToShowNotification = ableToShowNotification
      break
    default:
      break
  }
  next(action)
}
