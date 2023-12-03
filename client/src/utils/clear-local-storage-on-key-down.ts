import { clientConstants } from 'src/client-constants'
import { $clg } from 'src/services'

/**
 * Shorthand for clear persisted store cmd + enter
 * @param e KeyBoardEvent
 */
export const clearLocalStorageOnKeyDown = (e: KeyboardEvent): void => {
  if (e.ctrlKey && e.key === 'Enter') {
    localStorage.clear()
    $clg('success', 'local storage cleared')
    setTimeout(() => {
      window.location.reload()
    }, clientConstants.commonTimeoutDuration)
  }
}
