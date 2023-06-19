import $clg from 'src/services/$clg'
/**
 * Shorthand for clear persisted store cmd + enter
 * @param e KeyBoardEvent
 */
const clearLocalStorageOnKeyDown = (e: KeyboardEvent): void => {
  if (e.ctrlKey && e.key === 'Enter') {
    localStorage.clear()
    $clg('success', 'local storage cleared')
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
}

export default clearLocalStorageOnKeyDown
