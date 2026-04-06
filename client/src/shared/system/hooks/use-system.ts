import { useTypedSelector } from '../../store'

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
  const haveMessageToReply = Boolean(repliedMessageData?.id)

  return {
    auth,
    online,
    hasInteracted,
    micPermission,
    camPermission,
    reconnecting,
    contextMenu,
    viewPort,
    repliedMessageData,
    haveMessageToReply,
    messageInputData
  }
}
