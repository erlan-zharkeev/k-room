import { useTypedSelector } from 'src/shared/lib'

import appData from './../../../../package.json'

export const useSystem = () => {
  const { isAppLoading, showModal, hasInteracted, micPermission, camPermission, reconnecting, modalData, contextMenu } =
    useTypedSelector((state) => state.system)

  return {
    isAppLoading,
    showModal,
    appData,
    hasInteracted,
    micPermission,
    camPermission,
    reconnecting,
    modalData,
    contextMenu
  }
}
