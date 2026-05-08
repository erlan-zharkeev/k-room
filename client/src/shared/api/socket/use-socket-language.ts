import { isUnknownObject, type AppLanguageType } from 'global-shared'

import { socket } from './socket'

export const setSocketLanguage = (language: AppLanguageType) => {
  socket.auth = {
    ...(isUnknownObject(socket.auth) ? socket.auth : {}),
    language
  }
}

export const updateSocketLanguage = (language: AppLanguageType) => {
  setSocketLanguage(language)
  socket.emit('update-language', { language })
}
