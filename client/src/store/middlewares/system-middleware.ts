import { ChatRoom, EventMessageDelivered } from 'common-types'
import { MessageNotification } from 'src/components'
import { $sound } from 'src/services'
import { AppDispatch } from '..'
import { MiddlewareAPI, AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'
import { LogoImage } from 'src/assets'
import { UseNotification } from 'src/hooks/use-notification'

export const SystemMiddleware =
  (store: MiddlewareAPI<AppDispatch, any>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    if (!action) return
    switch (action.type) {
      case 'rooms/updateChatMessage':
        const { soundOn } = store.getState().persist.settings
        const { allowAudioContext } = store.getState().system
        const { message, roomId, notifications } = action.payload as EventMessageDelivered & {
          notifications: UseNotification
        }
        if (!message.isSelf) {
          const incomeMessageNotification = notifications.getNotification({
            message: MessageNotification(message),
            messageType: 'info'
          })
          incomeMessageNotification.open()
          const rooms = store.getState().chatRooms.chatRooms as ChatRoom[]
          const room = rooms.find((room) => room.id === roomId)
          const icon = room && room.avatarPath ? room.avatarPath : LogoImage
          new Notification(message.authorName, { body: message.body, icon })
          if (soundOn && allowAudioContext) $sound('message-delivered').play()
        }
        break
      default:
        break
    }
    next(action)
  }
