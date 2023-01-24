import { MessageNotification } from 'src/components/Common/MessageNotification/MessageNotification'
import { $sound, Sounds } from 'src/services/$sound'
import { showNotification } from '../systemSlice'
import changeSettingsHandler from './helpers/changeSettingsHandler'

export const SystemMiddleware = (store: any) => (next: any) => (action: any) => {
  const dispatch = store.dispatch
  changeSettingsHandler(action, store, dispatch)
  switch (action.type) {
    case 'rooms/updateChatMessage':
      const { soundOn } = store.getState().persist.settings
      const { message } = action.payload
      if (!message.isSelf) {
        dispatch(
          showNotification({ message: MessageNotification(message), messageType: 'info', placement: 'bottomRight' })
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

export default SystemMiddleware
