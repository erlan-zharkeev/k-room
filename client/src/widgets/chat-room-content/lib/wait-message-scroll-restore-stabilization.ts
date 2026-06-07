import { MESSAGE_SCROLL_RESTORE_STABILIZATION_FRAMES } from '../config/constants'

const waitMessageScrollRestoreFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve())
  })

export const waitMessageScrollRestoreStabilization = async () => {
  for (let frameIndex = 0; frameIndex < MESSAGE_SCROLL_RESTORE_STABILIZATION_FRAMES; frameIndex += 1) {
    await waitMessageScrollRestoreFrame()
  }
}
