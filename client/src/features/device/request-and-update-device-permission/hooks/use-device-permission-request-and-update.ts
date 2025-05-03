import { useDispatch } from 'react-redux'

import { updateCamPermission, updateMicPermission } from 'src/entities/system'

export const useDevicePermissionRequestAndUpdate = () => {
  const dispatch = useDispatch()

  const requestAndUpdateMicPermission = async () => {
    const permission = await navigator.permissions.query({ name: 'microphone' })
    dispatch(updateMicPermission(permission.state))
    return permission.state
  }

  const requestAndUpdateCamPermission = async () => {
    const permission = await navigator.permissions.query({ name: 'camera' })
    dispatch(updateCamPermission(permission.state))
    return permission.state
  }

  return { requestAndUpdateMicPermission, requestAndUpdateCamPermission }
}
