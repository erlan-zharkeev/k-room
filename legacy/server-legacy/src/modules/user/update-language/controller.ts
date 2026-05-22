import { APP_LANGUAGE_VALUES, EventUpdateLanguage, SocketActions } from 'common'

import { SocketInstance } from 'src/shared/config'
import { socketErrorMiddleware } from 'src/shared/middleware/socket-error-middleware'

import { USER_SOCKET_I18N } from '../config/i18n'

export const updateLanguageController = (socket: SocketInstance) => {
  socket.on<SocketActions>(
    'update-language',
    socketErrorMiddleware(
      socket,
      ({ language }: EventUpdateLanguage) => {
        if (!APP_LANGUAGE_VALUES.includes(language)) return
        socket.data.language = language
      },
      { basicError: USER_SOCKET_I18N.updateLanguageFailed }
    )
  )
}
