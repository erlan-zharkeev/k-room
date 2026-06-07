import { isUnknownObject, type AppLanguage } from 'global-shared'

import { socket } from './socket'

export const setSocketLanguage = (language: AppLanguage) => {
  socket.auth = {
    ...(isUnknownObject(socket.auth) ? socket.auth : {}),
    language
  }
}

export const updateSocketLanguage = (language: AppLanguage) => {
  setSocketLanguage(language)

  if (!socket.connected) return

  socket.emit('update-language', { language })
}
