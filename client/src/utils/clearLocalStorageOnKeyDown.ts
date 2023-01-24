import $clg from 'src/services/$clg'
/**
 * Shorthand for clear persisted store cmd + enter
 * @param e KeyBoardEvent
 */
export const clearLocalStorageOnKeyDown = (e: KeyboardEvent): void => {
  if (e.ctrlKey && e.key === 'Enter') {
    localStorage.clear()
    window.location.reload()
    $clg('success', 'ls cleared')
  }
}

export default clearLocalStorageOnKeyDown
