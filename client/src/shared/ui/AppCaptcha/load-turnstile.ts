import { TURNSTILE_SCRIPT_ID, TURNSTILE_SCRIPT_SRC } from './constants'

let turnstileLoadPromise: Promise<Window['turnstile'] | null> | null = null

export const loadTurnstile = () => {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile)
  }

  if (turnstileLoadPromise) {
    return turnstileLoadPromise
  }

  turnstileLoadPromise = new Promise((resolve) => {
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.turnstile ?? null), { once: true })
      existingScript.addEventListener('error', () => resolve(null), { once: true })
      return
    }

    const script = document.createElement('script')

    script.id = TURNSTILE_SCRIPT_ID
    script.src = TURNSTILE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.addEventListener('load', () => resolve(window.turnstile ?? null), { once: true })
    script.addEventListener('error', () => resolve(null), { once: true })
    document.head.appendChild(script)
  })

  return turnstileLoadPromise
}
