import { clg } from './clg'

/**
 * Shorthand for clear persisted store cmd + enter
 * @param e KeyBoardEvent
 */
export const clearLocalStorageOnKeyDown = (e: KeyboardEvent): void => {
  if (e.ctrlKey && e.key === 'Enter') {
    localStorage.clear()
    clg('success', 'local storage cleared')
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }
}
