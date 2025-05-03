import { IEventUpdateUserSettings, SocketActionsType } from 'common-types'

import { socket } from 'src/shared/api'

export const saveUserSetting = (payload: IEventUpdateUserSettings) => {
  socket.emit<SocketActionsType>('update-user-settings', payload)
}
