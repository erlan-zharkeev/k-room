import { APP_LANGUAGE_VALUES, IEventUpdateLanguage, SocketActionsType } from 'common'

import { SocketInstanceType } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware'

import { USER_SOCKET_I18N } from './../config'

export const updateLanguageController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>(
    'update-language',
    socketErrorMiddleware(
      socket,
      ({ language }: IEventUpdateLanguage) => {
        if (!APP_LANGUAGE_VALUES.includes(language)) return
        socket.data.language = language
      },
      { basicError: USER_SOCKET_I18N.updateLanguageFailed }
    )
  )
}
