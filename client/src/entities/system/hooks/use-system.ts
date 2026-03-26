import { CLIENT_ENV } from 'src/shared/config'
import { useTypedSelector } from 'src/shared/lib'

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
    appData: {
      name: CLIENT_ENV.appName,
      version: CLIENT_ENV.appVersion
    },
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
