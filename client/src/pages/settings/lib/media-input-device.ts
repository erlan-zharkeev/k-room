export const isPermissionDeniedError = (error: unknown) =>
  error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')

export const buildInputDeviceConstraints = (devices: MediaDeviceInfo[], deviceId: string) => {
  if (deviceId && devices.some((device) => device.deviceId === deviceId)) {
    return { deviceId: { exact: deviceId } }
  }

  return true
}

export const canRequestMediaInput = () =>
  typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia)

export const canEnumerateMediaDevices = () =>
  typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.enumerateDevices)
