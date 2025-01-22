import { ChatRoom, NotificationType, SocketActionsPayload } from 'common-types'
import { MessageNotification } from 'src/components'
import { $sound, Sounds } from 'src/services'
import { AppDispatch } from '..'
import { MiddlewareAPI, AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { LogoImage } from 'src/assets'
import { useNotification } from 'src/hooks'

export const SystemMiddleware =
  (store: MiddlewareAPI<AppDispatch, any>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    if (!action) return
    switch (action.type) {
      case 'rooms/updateChatMessage':
        const { soundOn } = store.getState().persist.settings
        const { allowAudioContext } = store.getState().system
        const { message, roomId } = action.payload as SocketActionsPayload['messageDelivered']
        if (!message.isSelf) {
          const notifications = useNotification();
          const incomeMessageNotification = notifications.getNotification({
            message: MessageNotification(message),
            messageType: NotificationType.info,
          })
          incomeMessageNotification.open();
          const rooms = store.getState().chatRooms.chatRooms as ChatRoom[]
          const room = rooms.find((room) => room.id === roomId)
          const icon = room && room.avatarPath ? room.avatarPath : LogoImage
          new Notification(message.authorName, { body: message.body, icon })
          if (soundOn && allowAudioContext) $sound(Sounds.messageDelivered).play()
        }
        break
      default:
        break
    }
    next(action)
  }
