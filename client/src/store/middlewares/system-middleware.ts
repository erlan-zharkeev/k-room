import { NotificationType } from 'common-types'
import { MessageNotification } from 'src/components'
import { $sound, Sounds } from 'src/services'
import { AppDispatch, showNotification } from '..'
import { MiddlewareAPI, AnyAction } from '@reduxjs/toolkit'
import { Dispatch } from 'react'

export const SystemMiddleware =
  (store: MiddlewareAPI<AppDispatch, any>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
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
