import { APP_LANGUAGE_VALUES, IEventUpdateLanguage, SocketActionsType } from 'common'

import { SocketInstanceType } from 'src/shared/config'

export const updateLanguageController = (socket: SocketInstanceType) => {
  socket.on<SocketActionsType>('update-language', ({ language }: IEventUpdateLanguage) => {
    if (!APP_LANGUAGE_VALUES.includes(language)) return
    socket.data.language = language
  })
}
