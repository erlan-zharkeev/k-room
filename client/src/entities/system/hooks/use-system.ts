import { useTypedSelector } from 'src/shared/lib'

import appData from './../../../../package.json'

export const useSystem = () => {
  const {
    auth,
    online,
    hasInteracted,
    micPermission,
    camPermission,
    reconnecting,
    contextMenu,
    viewPort,
    repliedMessageData,
    messageInputData
  } = useTypedSelector((state) => state.system)

  return {
    auth,
    online,
    appData,
    hasInteracted,
    micPermission,
    camPermission,
    reconnecting,
    contextMenu,
    viewPort,
    repliedMessageData,
    messageInputData
  }
}
