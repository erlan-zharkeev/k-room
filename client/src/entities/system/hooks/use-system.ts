import { useTypedSelector } from 'src/shared/lib'

import appData from './../../../../package.json'

export const useSystem = () => {
  const {
    auth,
    showModal,
    online,
    hasInteracted,
    micPermission,
    camPermission,
    reconnecting,
    modalData,
    contextMenu,
    viewPort
  } = useTypedSelector((state) => state.system)

  return {
    auth,
    showModal,
    online,
    appData,
    hasInteracted,
    micPermission,
    camPermission,
    reconnecting,
    modalData,
    contextMenu,
    viewPort
  }
}
